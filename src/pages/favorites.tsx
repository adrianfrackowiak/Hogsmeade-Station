import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { auth, db } from '../config/firebase';
import IPageProps from '../interfaces/page';
import bgimg from '../static/images/bg1.png';
import hatSvg from '../static/images/hat.svg';
import broomSvg from '../static/images/broom.svg';
import potionSvg from '../static/images/potion.svg';
import axios, { AxiosResponse } from 'axios';
import { FaTimes } from 'react-icons/fa';
import logging from '../config/logging';
import Loading from '../components/Loading';

interface Wizard {
    id: number;
    name: string;
    house: string;
    img: string;
}

interface Place {
    name: string;
}

interface Spell {
    id: number;
    name: string;
}

interface Favorites {
    wizard: string;
    spell: string;
    place: string;
}

const FavoritesPage: React.FunctionComponent<IPageProps> = (props) => {
    const [loading, setLoading]: [boolean, (loading: boolean) => void] =
        useState<boolean>(true);

    const [favWiz, setFavWiz] = useState<string>('');
    const [wizChoice, setWizChoice] = useState<boolean>(false);
    const [sortedWiz, setSortedWiz] = useState<string[]>([]);

    const [favSpell, setFavSpell] = useState<string>('');
    const [spellChoice, setSpellChoice] = useState<boolean>(false);

    const [favPlace, setFavPlace] = useState<string>('');
    const [placeChoice, setPlaceChoice] = useState<boolean>(false);

    const [wizards, setWizards] = useState<Wizard[]>([]);
    const [places, setPlaces] = useState<Place[]>([]);
    const [spells, setSpells] = useState<Spell[]>([]);

    const getDatabaseFavorites = () => {
        const database = db.ref();

        if (auth.currentUser) {
            database
                .child('users/')
                .child(auth.currentUser.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.child('favorites').exists()) {
                        setFavWiz(snapshot.val().favorites.wizard);
                        setFavSpell(snapshot.val().favorites.spell);
                        setFavPlace(snapshot.val().favorites.place);
                    } else {
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

        getDatabaseFavorites();

        axios
            .get<Wizard[]>('https://hp---api.herokuapp.com/wizards')
            .then((response: AxiosResponse) => {
                setWizards(response.data);
                axios
                    .get<Spell[]>(
                        'https://hp---api.herokuapp.com/spellsandpotions'
                    )
                    .then((response: AxiosResponse) => {
                        setSpells(response.data);
                        axios
                            .get<Place[]>(
                                'https://hp---api.herokuapp.com/placesandtransport'
                            )
                            .then((response: AxiosResponse) => {
                                setPlaces(response.data);
                                setLoading(false);
                            });
                    });
            });
    }, []);

    useEffect(() => {
        const wizArray: string[] = [];
        wizards.map((wizard) => {
            wizArray.push(wizard.name);
        });
        setSortedWiz(wizArray.sort());
    }, [wizards]);

    const chooseFavWiz = (name: string) => {
        setFavWiz(name);
        setWizChoice(false);
    };

    const chooseFavSpell = (name: string) => {
        setFavSpell(name);
        setSpellChoice(false);
    };

    const chooseFavPlace = (name: string) => {
        setFavPlace(name);
        setPlaceChoice(false);
    };

    const pushToDataBase = (favorites: Favorites) => {
        if (auth.currentUser) {
            const id = auth.currentUser.uid;
            const database = db.ref(`users/${id}/favorites`);

            database.set(favorites).catch((error: any) => {
                logging.error(error);
            });
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <main
                className="favorites"
                style={{ display: wizChoice ? 'none' : 'block' }}
            >
                <h2>Choose your favorites</h2>
                <p>
                    Choose your favorites from the three sections. It'll
                    automatically save to your profile.
                </p>
                <div className="favorites__slider">
                    <div
                        onClick={() => setWizChoice(true)}
                        className="favorites__slider__wizard"
                    >
                        <p>Wizards</p>
                        <img src={hatSvg} alt="Wizard" />
                        {favWiz === '' ? (
                            <p>Choose your favorite wizard</p>
                        ) : (
                            <p>{favWiz}</p>
                        )}
                    </div>
                    <div
                        onClick={() => setSpellChoice(true)}
                        className="favorites__slider__spells"
                    >
                        <p>Spells & Potions</p>
                        <img src={potionSvg} alt="Wizard" />
                        {favSpell === '' ? (
                            <p>Choose your favorite spell or potion</p>
                        ) : (
                            <p>{favSpell}</p>
                        )}
                    </div>
                    <div
                        onClick={() => setPlaceChoice(true)}
                        className="favorites__slider__places"
                    >
                        <p>Places & Transport</p>
                        <img src={broomSvg} alt="Wizard" />
                        {favPlace === '' ? (
                            <p>Choose your favorite place or trasport</p>
                        ) : (
                            <p>{favPlace}</p>
                        )}
                    </div>
                </div>
            </main>
            {wizChoice ? (
                <div className="favorites__choice">
                    <button
                        className="favorites__choice__close"
                        onClick={() => setWizChoice(false)}
                    >
                        <FaTimes size={20} />
                    </button>
                    <ul>
                        {sortedWiz.map((wizard) => {
                            return (
                                <li>
                                    <button
                                        onClick={() => {
                                            chooseFavWiz(wizard);
                                            pushToDataBase({
                                                wizard: wizard,
                                                spell: favSpell,
                                                place: favPlace,
                                            });
                                        }}
                                    >
                                        {wizard}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ) : (
                ''
            )}
            {spellChoice ? (
                <div className="favorites__choice">
                    <button
                        className="favorites__choice__close"
                        onClick={() => setSpellChoice(false)}
                    >
                        <FaTimes size={20} />
                    </button>
                    <ul>
                        {spells.map((spell) => {
                            return (
                                <li>
                                    <button
                                        onClick={() => {
                                            chooseFavSpell(spell.name);

                                            pushToDataBase({
                                                wizard: favWiz,
                                                spell: spell.name,
                                                place: favPlace,
                                            });
                                        }}
                                    >
                                        {spell.name}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ) : (
                ''
            )}
            {placeChoice ? (
                <div className="favorites__choice">
                    <button
                        className="favorites__choice__close"
                        onClick={() => setPlaceChoice(false)}
                    >
                        <FaTimes size={20} />
                    </button>
                    <ul>
                        {places.map((place) => {
                            return (
                                <li>
                                    <button
                                        onClick={() => {
                                            chooseFavPlace(place.name);

                                            pushToDataBase({
                                                wizard: favWiz,
                                                spell: favSpell,
                                                place: place.name,
                                            });
                                        }}
                                    >
                                        {place.name}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ) : (
                ''
            )}
        </>
    );
};

export default FavoritesPage;
