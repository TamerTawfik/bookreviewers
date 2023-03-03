import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import { UserContext } from '../lib/context';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';
import { auth } from '../lib/firebase';
import { serverTimestamp, query, collection, orderBy, getFirestore, setDoc, doc } from 'firebase/firestore';

const customStyles = {
    content: {
        top: '150px',

    },

};

export default function BookItemModal({ bookItem }) {
    const [modalIsOpen, setIsOpen] = useState(false);

    const router = useRouter();
    const { username } = useContext(UserContext);

    let thumbnail = bookItem.volumeInfo.imageLinks && bookItem.volumeInfo.imageLinks.thumbnail;
    let authors = bookItem.volumeInfo && bookItem.volumeInfo.authors;


    // Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
    Modal.setAppElement(document.getElementById('modalBook'));
    // Modal.defaultStyles.overlay.backgroundColor = 'cornsilk';

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
    }

    const saveHandler = async (bookItem) => {
        const uid = auth.currentUser.uid;
        const title = bookItem.volumeInfo.title
        const bookLink = bookItem.selfLink;
        // Ensure slug is URL safe
        const slug = encodeURI(kebabCase(title));
        const ref = doc(getFirestore(), 'users', uid, 'posts', slug);

        // Tip: give all fields a default value here
        const data = {
            title: title,
            slug: slug,
            bookLink: bookLink,
            uid: uid,
            username: username,
            published: false,
            rate: 0,
            content: "",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        await setDoc(ref, data);

        toast.success('Book Saved');

        // Imperative navigation after doc is set
        router.push(`/admin/${slug}`);
    }


    return <div id='modalBook'>
        <button onClick={openModal}>More...</button>


        {thumbnail ? <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <div>
                <img
                    src={`${thumbnail}?w=162&auto=format`}
                    srcSet={`${thumbnail}?w=162&auto=format&dpr=2 2x`}
                    alt={bookItem.volumeInfo.title}
                    loading="lazy"
                    style={{
                        borderBottomLeftRadius: 4,
                        borderBottomRightRadius: 4,
                        display: 'block',
                        width: '50%',
                    }}
                />
                <p >
                    {bookItem.volumeInfo.title}
                </p>
                <p >
                    {authors}
                </p>
                <button onClick={closeModal}>Cancel </button>
                <button onClick={() => saveHandler(bookItem)}>Save </button>
                <p >
                    {bookItem.volumeInfo.description ? bookItem.volumeInfo.description.slice(0, 250) + '...' : ''}
                </p>
            </div>
        </Modal> : null}

    </div>
};