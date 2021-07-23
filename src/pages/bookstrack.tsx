import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { auth, db } from '../config/firebase';
import Layout from '../components/Layout';
import logging from '../config/logging';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import bgimg from '../static/images/bg1.png';
import barimg from '../static/images/bar.png';
import { WiStars } from 'react-icons/wi';
import ScrollDown from '../components/ScrollDown';
import Loading from '../components/Loading';

interface Book {
    id: number;
    title: string;
    chapters: string[];
    chapters_amount: number;
    img: string;
    desc: string;
}

interface CurrentBook {
    id?: number;
    title?: string;
    chapter?: string;
    chapter_key?: number;
    chapters_amount?: number;
}

const BooksTrack: React.FC = () => {
    const [booksList, setBooksList] = useState<Book[]>([]);
    const [currentBook, setCurrentBook] = useState<CurrentBook>({
        title: `Harry Potter and the Philosopher's Stone`,
        chapter: 'The Boy Who Lived',
    });

    const [databaseBook, setDatabaseBook] = useState<CurrentBook>({
        id: 0,
        title: ``,
        chapter: '',
        chapter_key: 0,
        chapters_amount: 0,
    });

    const [isDatabaseBook, setIsDatabaseBook] = useState<boolean>(false);

    const [loading, setLoading]: [boolean, (loading: boolean) => void] =
        useState<boolean>(true);

    const [progress, setProgress] = useState<number>(0);

    const progressStyle = {
        width: `${progress}%`,
        height: `100%`,
        borderRadius: `10rem`,
        backgroundImage: `url(${barimg})`,
    };

    const [bookNav, setBookNav] = useState<number>(0);

    const [chaptersNav, setChaptersNav] = useState<number[]>([0, 3]);

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
                            id: snapshot.val().bookstrack.id,
                            title: snapshot.val().bookstrack.title,
                            chapter: snapshot.val().bookstrack.chapter,
                            chapter_key: snapshot.val().bookstrack.chapter_key,
                            chapters_amount:
                                snapshot.val().bookstrack.chapters_amount,
                        });
                        setProgress(
                            Math.floor(
                                (snapshot.val().bookstrack.chapter_key /
                                    snapshot.val().bookstrack.chapters_amount) *
                                    100
                            )
                        );
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
        document.body.style.backgroundImage = `url(${bgimg})`;
        getDatabaseBook();

        axios
            .get<Book[]>('https://hp---api.herokuapp.com/books')
            .then((response: AxiosResponse) => {
                setBooksList(response.data);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <Loading />;
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

    const chapterChange = (
        id: number,
        title: string,
        newChapter: string,
        chapterNum: number,
        chaptersAmount: number
    ) => {
        const newCurrentChapter: CurrentBook = {
            id: id,
            title: title,
            chapter: newChapter,
            chapter_key: chapterNum,
            chapters_amount: chaptersAmount,
        };
        setCurrentBook(newCurrentChapter);
        pushToDataBase(newCurrentChapter);
        getDatabaseBook();

        setProgress(Math.floor((chapterNum / chaptersAmount) * 100));
    };

    const navChange = (id: number) => {
        setBookNav(id - 1);
        setChaptersNav([0, 3]);
    };

    const chaptersNavChange = (btn: string) => {
        if (btn === 'prev') {
            if (chaptersNav[0] !== 0) {
                setChaptersNav([chaptersNav[0] - 1, chaptersNav[1] - 1]);
            }
        } else if (btn === 'next') {
            if (chaptersNav[1] !== booksList[bookNav].chapters_amount) {
                setChaptersNav([chaptersNav[0] + 1, chaptersNav[1] + 1]);
            }
        }
    };

    return (
        <main className="bookstrack">
            <div className="bookstrack__userdata">
                <p>You're now in</p>
                <h2>{databaseBook.chapter}</h2>
                <h3>{databaseBook.title}</h3>
                <p>{`Chapter ${databaseBook.chapter_key} / ${databaseBook.chapters_amount}`}</p>
                <div className="bookstrack__userdata__progressbar">
                    <div style={progressStyle}></div>
                </div>
                <p>
                    Choose a book and a chapter you're reading now and track it.
                </p>
                <ScrollDown />
            </div>
            <div className="bookstrack__books">
                <nav className="bookstrack__books__nav">
                    <ul>
                        {booksList.map((book) => {
                            return bookNav === book.id - 1 ? (
                                <li>
                                    <button
                                        className="book-active"
                                        onClick={() => navChange(book.id)}
                                    >
                                        {book.id}
                                    </button>
                                </li>
                            ) : (
                                <li>
                                    <button onClick={() => navChange(book.id)}>
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
                    <div className="bookstrack__books__main__info">
                        <h2>{booksList[bookNav].title}</h2>
                        <p>{booksList[bookNav].desc}</p>
                    </div>
                </div>
                <div className="bookstrack__books__main__chapters">
                    <ul>
                        <button
                            type="button"
                            onClick={() => chaptersNavChange('prev')}
                        >
                            <BiLeftArrow />
                        </button>
                        {booksList[bookNav].chapters
                            .slice(chaptersNav[0], chaptersNav[1])
                            .map((chapter, index) => {
                                const chapterNum =
                                    booksList[bookNav].chapters.indexOf(
                                        chapter
                                    );
                                return (
                                    <li key={index}>
                                        <button
                                            onClick={() =>
                                                chapterChange(
                                                    booksList[bookNav].id,
                                                    booksList[bookNav].title,
                                                    chapter,
                                                    chapterNum,
                                                    booksList[bookNav]
                                                        .chapters_amount
                                                )
                                            }
                                        >
                                            {chapter}
                                        </button>
                                    </li>
                                );
                            })}
                        <button
                            type="button"
                            onClick={() => chaptersNavChange('next')}
                        >
                            <BiRightArrow />
                        </button>
                    </ul>
                </div>
            </div>
        </main>
    );
};

export default BooksTrack;
