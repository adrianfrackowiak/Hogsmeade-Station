import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

import hatSvg from '../static/images/hat.svg';
import potionSvg from '../static/images/potion.svg';
import broomSvg from '../static/images/broom.svg';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';
import 'swiper/components/navigation/navigation.min.css';
import SwiperCore, { Pagination, Navigation } from 'swiper/core';
SwiperCore.use([Pagination, Navigation]);

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

interface CurrentFavorites {
    wizard?: string;
    place?: string;
    spell?: string;
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

    const [currentFavorites, setCurrentFavorites] = useState<CurrentFavorites>({
        wizard: '',
        place: '',
        spell: '',
    });

    const [progress, setProgress] = useState<number>();
    const [progressColor, setProgressColor] = useState<string>(barimg);

    const progressWidth = {
        width: `${progress}%`,
        backgroundImage: `url(${progressColor})`,
        height: `100%`,
        backgroundPosition: `center`,
    };

    const progressWidthFull = {
        width: `100%`,
        backgroundImage: `url(${progressColor})`,
        height: `100%`,
        backgroundPosition: `center`,
    };

    const progressWidthEmpty = {
        width: `0%`,
        backgroundImage: `url(${progressColor})`,
        height: `100%`,
        backgroundPosition: `center`,
    };

    const activeFavoriteStyle = {
        width: `18rem`,
        height: `22rem`,
        opacity: `1`,
    };

    const favoriteStyle = {
        width: `calc(0.9 * 18rem)`,
        height: `calc(0.9 * 22rem)`,
        opacity: `0.5`,
        margin: `0 0 4rem 0`,
    };

    const favoriteStyleMobile = {
        width: `calc(0.9 * 18rem)`,
        height: `calc(0.9 * 22rem)`,
        opacity: `1`,
        margin: `0 0 4rem 0`,
    };

    const [swiperRef, setSwiperRef] = useState<any>(null);

    const [width, setWidth] = useState<number>(window.innerWidth);
    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    let isMobile: boolean = width <= 768;

    useEffect(() => {
        axios
            .get<Book[]>('https://hp---api.herokuapp.com/books')
            .then((response: AxiosResponse) => {
                setBooksList(response.data);

                setLoading(false);
            });

        setCurrentBook({
            id: userProfile.bookstrack?.id,
            title: userProfile.bookstrack?.title,
            chapter: userProfile.bookstrack?.chapter,
            chapter_key: userProfile.bookstrack?.chapter_key,
            chapters_amount: userProfile.bookstrack?.chapters_amount,
        });

        setCurrentFavorites({
            wizard: userProfile.favorites?.wizard,
            spell: userProfile.favorites?.spell,
            place: userProfile.favorites?.place,
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
                {userProfile.house ? (
                    <h2>{userProfile.house}</h2>
                ) : (
                    <Link to="/sortinghat">
                        <h2>Discover Your House</h2>
                    </Link>
                )}
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
            <div className="profile__favorites">
                {isMobile ? (
                    <Swiper
                        onSwiper={setSwiperRef}
                        slidesPerView={1}
                        centeredSlides={true}
                        spaceBetween={10}
                        pagination={{
                            type: 'fraction',
                        }}
                        className="favorites__slider"
                    >
                        <SwiperSlide
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <div
                                className="profile__favorites__wizard"
                                style={favoriteStyleMobile}
                            >
                                <p>Wizards</p>
                                <img src={hatSvg} alt="Wizard" />
                                {userProfile.favorites?.wizard === '' ? (
                                    <p>Choose your favorite wizard</p>
                                ) : (
                                    <p>{userProfile.favorites?.wizard}</p>
                                )}
                            </div>
                        </SwiperSlide>
                        <SwiperSlide
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <div
                                className="profile__favorites__wizard"
                                style={favoriteStyleMobile}
                            >
                                <p>Spells & Potions</p>
                                <img src={potionSvg} alt="Wizard" />
                                {userProfile.favorites?.spell === '' ? (
                                    <p>Choose your favorite spell or potion</p>
                                ) : (
                                    <p>{userProfile.favorites?.spell}</p>
                                )}
                            </div>
                        </SwiperSlide>
                        <SwiperSlide
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <div
                                className="profile__favorites__wizard"
                                style={favoriteStyleMobile}
                            >
                                <p>Places & Transport</p>
                                <img src={broomSvg} alt="Wizard" />
                                {userProfile.favorites?.place === '' ? (
                                    <p>
                                        Choose your favorite place or trasport
                                    </p>
                                ) : (
                                    <p>{userProfile.favorites?.place}</p>
                                )}
                            </div>
                        </SwiperSlide>
                    </Swiper>
                ) : (
                    <>
                        <div
                            className="profile__favorites__wizard"
                            style={favoriteStyle}
                        >
                            <p>Wizards</p>
                            <img src={hatSvg} alt="Wizard" />
                            {userProfile.favorites?.wizard === '' ? (
                                <p>Choose your favorite wizard</p>
                            ) : (
                                <p>{userProfile.favorites?.wizard}</p>
                            )}
                        </div>
                        <div
                            className="profile__favorites__wizard"
                            style={activeFavoriteStyle}
                        >
                            <p>Spells & Potions</p>
                            <img src={potionSvg} alt="Wizard" />
                            {userProfile.favorites?.spell === '' ? (
                                <p>Choose your favorite spell or potion</p>
                            ) : (
                                <p>{userProfile.favorites?.spell}</p>
                            )}
                        </div>
                        <div
                            className="profile__favorites__wizard"
                            style={favoriteStyle}
                        >
                            <p>Places & Transport</p>
                            <img src={broomSvg} alt="Wizard" />
                            {userProfile.favorites?.place === '' ? (
                                <p>Choose your favorite place or trasport</p>
                            ) : (
                                <p>{userProfile.favorites?.place}</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
};

export default ProfilePage;
