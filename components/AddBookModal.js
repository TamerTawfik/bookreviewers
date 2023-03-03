import Modal from 'react-modal';
import axios from 'axios';
import { useState } from 'react';

import MDButton from './base/MDButton';
import MDBox from './base/MDBox';

import SearchResultList from './SearchResultList';

const customStyles = {
    content: {
        top: '150px',

    },

};

export default function AddBookMadal() {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [results, setResults] = useState([]);

    // Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
    Modal.setAppElement(document.getElementById('modal'));
    // Modal.defaultStyles.overlay.backgroundColor = 'cornsilk';

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
        setResults([]);
    }

    const submitHandler = (event) => {
        event.preventDefault();
        console.log("we made a search")
        console.log(searchText)

        axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchText}&maxResults=4`).then(data => {
            console.log(data);
            const result = data.data.items;

            setResults(result);
            console.log(result);
        }).catch(err => console.log(err));
    }


    return <div id='modal'>
        <MDBox py={2}>
            <MDButton
                size='large'
                color='dark'
                onClick={openModal}>
                Add Review
        </MDButton>
        </MDBox>



        {modalIsOpen ? <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <form>
                <input
                    onChange={(event) => setSearchText(event.target.value)}
                    type='text' placeholder='search new book' />
                <button onClick={submitHandler}>Add New Book</button>

            </form>
            <button onClick={closeModal}>close</button>
            <SearchResultList results={results} />
        </Modal> : null}
    </div>
};