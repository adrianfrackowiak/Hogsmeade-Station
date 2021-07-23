import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { auth, db } from '../config/firebase';
import IPageProps from '../interfaces/page';
import bgimg from '../static/images/bg1.png';
import barimg from '../static/images/bar.png';
import barGryfimg from '../static/images/bargryffindor.png';
import barSlytimg from '../static/images/barslytherin.png';
import barHuffimg from '../static/images/barhufflepuff.png';
import barRavenimg from '../static/images/barravenclaw.png';
import IProfile from '../interfaces/profile';
import axios, { AxiosResponse } from 'axios';
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
    const [progressColor, setProgressColor] = useState<string>(barimg);

    const progressWidth = {
        width: `${progress}%`,
        backgroundImage: `url(${progressColor})`,
        height: `100%`,
        borderRadius: `10rem`,
    };

    const progressWidthFull = {
        width: `100%`,
        backgroundImage: `url(${progressColor})`,
        height: `100%`,
        borderRadius: `10rem`,
    };

    const progressWidthEmpty = {
        width: `0%`,
        backgroundImage: `url(${progressColor})`,
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
        document.body.style.backgroundImage = `url(${bgimg})`;

        switch (userProfile.house) {
            case 'gryffindor':
                setProgressColor(barGryfimg);
                break;
            case 'ravenclaw':
                setProgressColor(barRavenimg);
                break;
            case 'slytherin':
                setProgressColor(barSlytimg);
                break;
            case 'hufflepuff':
                setProgressColor(barHuffimg);
                break;
        }
    }, [userProfile.house]);

    if (loading) {
        return <Loading />;
    }

    return (
        <main className="profile">
            <div className="profile__info">
                <p>
                    {userProfile.firstName} {userProfile.lastName}
                </p>
                <h2>{userProfile.house}</h2>
                <ScrollDown />
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
