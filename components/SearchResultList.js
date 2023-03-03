import * as React from 'react';
import BookItemModal from './BookItemModal';

export default function SearchResultList({ results }) {
    const [bookItem, setBookItem] = React.useState();

    return (<>
        <div style={{ backgroundColor: '#E7EBF0' }}>


            {results ? results.map(result => {
                let thumbnail = result.volumeInfo.imageLinks && result.volumeInfo.imageLinks.thumbnail;
                let authors = result.volumeInfo && result.volumeInfo.authors;
                if (thumbnail != undefined) {

                    return <>
                        <div
                            style={{ cursor: 'pointer' }}
                            key={result.id}
                        >
                            <img
                                src={`${thumbnail}?w=162&auto=format`}
                                srcSet={`${thumbnail}?w=162&auto=format&dpr=2 2x`}
                                alt={result.volumeInfo.title}
                                loading="lazy"
                                style={{
                                    borderBottomLeftRadius: 4,
                                    borderBottomRightRadius: 4,
                                    display: 'block',
                                    width: '10%',
                                }}
                            />

                            <span>
                                <div>{result.volumeInfo.title}</div>
                                <div> by {authors}</div>
                                <BookItemModal bookItem={result} />
                            </span>

                        </div>


                    </>

                }
            })

                : <p>Try again</p>}
        </div>

    </>
    );
}

