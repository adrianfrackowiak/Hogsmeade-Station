import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { auth, db } from '../config/firebase';
import logging from '../config/logging';
import bgimg from '../static/images/bgsortinghat.png';

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

const SortingHatPage: React.FC = () => {
    const [loading, setLoading]: [boolean, (loading: boolean) => void] =
        useState<boolean>(true);

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

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <Layout>
            <main className="sortinghat">
                <h2>Sorting Hat</h2>
                {questionNum !== 14 ? (
                    questions.map((question, key) => {
                        if (key === questionNum) {
                            return (
                                <div
                                    className="sortinghat__questionbox"
                                    key={key}
                                >
                                    <p>{question.question}</p>
                                    <ul>
                                        {question.answers.map((answer) => {
                                            return (
                                                <li>
                                                    <button
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
                )}
            </main>
        </Layout>
    );
};

export default SortingHatPage;
