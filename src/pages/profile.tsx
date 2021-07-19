import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { auth, db } from '../config/firebase';
import IPageProps from '../interfaces/page';
import bgG from '../static/images/bggryffindor.png';
import bgR from '../static/images/bgravenclaw.png';
import bgS from '../static/images/bgslytherin.png';
import bgH from '../static/images/bghufflepuff.png';
import IProfile from '../interfaces/profile';
import axios, { AxiosResponse } from 'axios';

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

const ProfilePage: React.FunctionComponent<IProfile> = (userProfile) => {
    const [loading, setLoading]: [boolean, (loading: boolean) => void] =
        useState<boolean>(true);

    const [booksList, setBooksList] = useState<Book[]>([]);

    const [currentBook, setCurrentBook] = useState<CurrentBook>({
        id: 0,
        title: '',
        chapter: '',
        chapter_key: 0,
        chapters_amount: 0,
    });

    const [progress, setProgress] = useState<number>();

    const progressWidth = {
        width: `${progress}%`,
        background: `white`,
        height: `100%`,
        borderRadius: `10rem`,
    };

    const progressWidthFull = {
        width: `100%`,
        background: `white`,
        height: `100%`,
        borderRadius: `10rem`,
    };

    const progressWidthEmpty = {
        width: `0%`,
        background: `white`,
        height: `100%`,
        borderRadius: `10rem`,
    };

    useEffect(() => {
        axios
            .get<Book[]>('https://hp---api.herokuapp.com/books')
            .then((response: AxiosResponse) => {
                setBooksList(response.data);

                setLoading(false);
            });

        console.log(userProfile.bookstrack?.chapter);
        setCurrentBook({
            id: userProfile.bookstrack?.id,
            title: userProfile.bookstrack?.title,
            chapter: userProfile.bookstrack?.chapter,
            chapter_key: userProfile.bookstrack?.chapter_key,
            chapters_amount: userProfile.bookstrack?.chapters_amount,
        });
    }, []);

    useEffect(() => {
        if (
            currentBook.chapter_key !== undefined &&
            currentBook.chapters_amount !== undefined
        ) {
            setProgress(
                Math.floor(
                    (currentBook.chapter_key / currentBook.chapters_amount) *
                        100
                )
            );
        }
    }, [currentBook]);

    useEffect(() => {
        document.body.style.backgroundImage = `url(${bgG})`;

        switch (userProfile.house) {
            case 'gryffindor':
                document.body.style.backgroundImage = `url(${bgG})`;
                break;
            case 'ravenclaw':
                document.body.style.backgroundImage = `url(${bgR})`;
                break;
            case 'slytherin':
                document.body.style.backgroundImage = `url(${bgS})`;
                break;
            case 'hufflepuff':
                document.body.style.backgroundImage = `url(${bgH})`;
                break;
        }
    }, [userProfile.house]);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <main className="profile">
            <div className="profile__info">
                <p>
                    {userProfile.firstName} {userProfile.lastName}
                </p>
                <h2>{userProfile.house}</h2>
            </div>
            <div className="profile__bookstrack">
                {booksList.map((book, key) => {
                    const id = userProfile.bookstrack?.id;
                    if (id !== undefined && key === id - 1) {
                        return (
                            <>
                                <p>{book.title}</p>
                                <div className="profile__bookstrack__progressbar">
                                    <div style={progressWidth}></div>
                                </div>
                            </>
                        );
                    } else if (id !== undefined && key < id - 1) {
                        return (
                            <>
                                <p>{book.title}</p>
                                <div className="profile__bookstrack__progressbar">
                                    <div style={progressWidthFull}></div>
                                </div>
                            </>
                        );
                    } else {
                        return (
                            <>
                                <p>{book.title}</p>
                                <div className="profile__bookstrack__progressbar">
                                    <div style={progressWidthEmpty}></div>
                                </div>
                            </>
                        );
                    }
                })}
            </div>
            <div className="profile__favorites"></div>
        </main>
    );
};

export default ProfilePage;
