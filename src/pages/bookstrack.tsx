import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { auth, db } from '../config/firebase';
import Layout from '../components/Layout';
import logging from '../config/logging';

interface Book {
    id: number;
    title: string;
    chapters: string[];
    chapters_amount: number;
    img: string;
}

interface CurrentBook {
    title?: string;
    chapter?: string;
    prevChapter?: string;
    nextChapter?: string;
}

interface DisplayChapters {
    bool: boolean;
    book: string;
}

const BooksTrack: React.FC = () => {
    const [booksList, setBooksList] = useState<Book[]>([]);
    const [currentBook, setCurrentBook] = useState<CurrentBook>({
        title: `Harry Potter and the Philosopher's Stone`,
        chapter: 'The Boy Who Lived',
        prevChapter: '',
        nextChapter: 'The Vanishing Glass',
    });

    const [databaseBook, setDatabaseBook] = useState<CurrentBook>({
        title: ``,
        chapter: '',
        prevChapter: '',
        nextChapter: '',
    });

    const [isDatabaseBook, setIsDatabaseBook] = useState<boolean>(false);

    const [displayChapters, setDisplayChapters] = useState<DisplayChapters>({
        bool: false,
        book: '',
    });

    const [loading, setLoading]: [boolean, (loading: boolean) => void] =
        useState<boolean>(true);

    const [bookNav, setBookNav] = useState<number>(0);

    const getDatabaseBook = () => {
        const database = db.ref();

        if (auth.currentUser) {
            database
                .child('users/')
                .child(auth.currentUser.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.child('bookstrack').exists()) {
                        setIsDatabaseBook(true);
                        setDatabaseBook({
                            title: snapshot.val().bookstrack.title,
                            chapter: snapshot.val().bookstrack.chapter,
                            prevChapter: snapshot.val().bookstrack.prevChapter,
                            nextChapter: snapshot.val().bookstrack.nextChapter,
                        });
                    } else {
                        setIsDatabaseBook(false);
                        console.log('No data available');
                    }
                })
                .catch((error: any) => {
                    console.error(error);
                });
        }
    };

    useEffect(() => {
        getDatabaseBook();

        axios
            .get<Book[]>('https://hp---api.herokuapp.com/books')
            .then((response: AxiosResponse) => {
                setBooksList(response.data);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    const pushToDataBase = (newCurrentBook: CurrentBook) => {
        if (auth.currentUser) {
            const id = auth.currentUser.uid;
            const database = db.ref(`users/${id}/bookstrack`);
            database.set(newCurrentBook).catch((error: any) => {
                logging.error(error);
            });
        }
    };

    const bookChange = (newTitle: string) => {
        if (displayChapters.bool && displayChapters.book === newTitle) {
            setDisplayChapters({ bool: false, book: '' });
        } else {
            setDisplayChapters({ bool: true, book: newTitle });
        }
    };

    const chapterChange = (
        title: string,
        newChapter: string,
        prev: string,
        next: string,
        chapterNum: number,
        chaptersAmount: number
    ) => {
        const newCurrentChapter: CurrentBook = {
            title: title,
            chapter: newChapter,
            prevChapter: prev,
            nextChapter: next,
        };
        setCurrentBook(newCurrentChapter);
        pushToDataBase(newCurrentChapter);
        getDatabaseBook();
    };

    const navChange = (id: number) => {
        setBookNav(id - 1);
    };

    return (
        <Layout>
            <main className="bookstrack">
                <div className="bookstrack__userdata">
                    <p>You're now in</p>
                    {isDatabaseBook ? (
                        <>
                            <h2>{databaseBook.chapter}</h2>
                            <p>{databaseBook.title}</p>
                            <div className="prevnext">
                                {databaseBook.prevChapter === '' ||
                                databaseBook.prevChapter === undefined ? (
                                    <p></p>
                                ) : (
                                    <p>Prev: {databaseBook.prevChapter}</p>
                                )}
                                {databaseBook.nextChapter === undefined ? (
                                    <p></p>
                                ) : (
                                    <p>Next: {databaseBook.nextChapter}</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <h2>{currentBook.chapter}</h2>
                            <p>{currentBook.title}</p>
                            <div className="prevnext">
                                {currentBook.prevChapter === '' ||
                                currentBook.prevChapter === undefined ? (
                                    <p></p>
                                ) : (
                                    <p>Prev: {currentBook.prevChapter}</p>
                                )}
                                {currentBook.nextChapter === undefined ? (
                                    <p></p>
                                ) : (
                                    <p>Next: {currentBook.nextChapter}</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
                <div className="bookstrack__books">
                    <nav className="bookstrack__books__nav">
                        <ul>
                            {booksList.map((book) => {
                                return (
                                    <li>
                                        <button
                                            onClick={() => navChange(book.id)}
                                        >
                                            {book.id}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                    <div className="bookstrack__books__main">
                        <div className="bookstrack__books__main__img">
                            <img src={booksList[bookNav].img} alt="" />
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
};

export default BooksTrack;
