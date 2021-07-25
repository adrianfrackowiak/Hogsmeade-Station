import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Layout from '../components/Layout';
import { auth, db } from '../config/firebase';
import logging from '../config/logging';
import IProfile from '../interfaces/profile';
import bgimg from '../static/images/bgsortinghat.png';
import Loading from '../components/Loading';

interface Question {
    id: number;
    question: string;
    answers: Answers[];
}

interface Answers {
    name: string;
    gryffindor: number;
    ravenclaw: number;
    hufflepuff: number;
    slytherin: number;
}

interface Houses {
    gryffindor: number;
    ravenclaw: number;
    hufflepuff: number;
    slytherin: number;
}

const SortingHatPage: React.FC<IProfile> = (userProfile) => {
    const [loading, setLoading]: [boolean, (loading: boolean) => void] =
        useState<boolean>(true);

    const [sorting, setSorting] = useState<boolean>(false);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [questionNum, setQuestionNum] = useState<number>(0);
    const [housesPoints, setHousesPoints] = useState<Houses>({
        gryffindor: 0,
        ravenclaw: 0,
        hufflepuff: 0,
        slytherin: 0,
    });
    const [house, setHouse] = useState<string>('');

    useEffect(() => {
        document.body.style.backgroundImage = `url(${bgimg})`;

        axios
            .get<Question[]>('https://hp---api.herokuapp.com/sortinghat')
            .then((response: AxiosResponse) => {
                setQuestions(response.data);
                setLoading(false);
            });
    }, []);

    const pushToDataBase = (house: string) => {
        if (auth.currentUser) {
            const id = auth.currentUser.uid;
            const database = db.ref(`users/${id}/house`);
            database.set(house).catch((error: any) => {
                logging.error(error);
            });
        }
    };

    useEffect(() => {
        console.log(housesPoints);
        console.log(
            Math.max(
                housesPoints.gryffindor,
                housesPoints.ravenclaw,
                housesPoints.slytherin,
                housesPoints.hufflepuff
            )
        );

        const objHouses = Object.entries(housesPoints);
        let max: number = 0;
        let maxHouse: string = '';

        objHouses.map((house) => {
            if (max < house[1]) {
                max = house[1];
                maxHouse = house[0];
            }
            setHouse(maxHouse);
        });

        if (questionNum === 14) pushToDataBase(house);
    }, [housesPoints, house, questionNum]);

    const updateHousesPoints = (
        gryf: number,
        rave: number,
        huff: number,
        slyt: number
    ) => {
        setHousesPoints({
            gryffindor: housesPoints.gryffindor + gryf,
            ravenclaw: housesPoints.ravenclaw + rave,
            hufflepuff: housesPoints.hufflepuff + huff,
            slytherin: housesPoints.slytherin + slyt,
        });
    };

    const nextQuestion = () => {
        setQuestionNum(questionNum + 1);
    };

    if (userProfile.house !== undefined) {
        return <Redirect to="/profile" />;
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <main className="sortinghat">
            {sorting ? (
                questionNum !== 14 ? (
                    questions.map((question, key) => {
                        if (key === questionNum) {
                            return (
                                <div
                                    className="sortinghat__questionbox"
                                    key={key}
                                >
                                    <h2>{question.question}</h2>
                                    <ul>
                                        {question.answers.map((answer) => {
                                            return (
                                                <li>
                                                    <button
                                                        className="answer"
                                                        onClick={() => {
                                                            updateHousesPoints(
                                                                answer.gryffindor,
                                                                answer.ravenclaw,
                                                                answer.hufflepuff,
                                                                answer.slytherin
                                                            );
                                                            nextQuestion();
                                                        }}
                                                    >
                                                        {answer.name}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            );
                        }
                    })
                ) : (
                    <p>{house}</p>
                )
            ) : (
                <div className="sortinghat__start">
                    <h2>Sorting Hat</h2>
                    <p>
                        Adorn the Sorting Hat to be placed into your rightful
                        Hogwarts house. The Sorting Hat's decision is final.
                    </p>
                    <button
                        className="start-btn"
                        onClick={() => setSorting(true)}
                    >
                        Start The Sorting Ceremony
                    </button>
                </div>
            )}
        </main>
    );
};

export default SortingHatPage;
