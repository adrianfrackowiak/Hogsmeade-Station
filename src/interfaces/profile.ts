export default interface IProfile {
    firstName?: string;
    lastName?: string;
    email?: string;
    house?: string;
    bookstrack?: Book;
}

interface Book {
    id?: number;
    title?: string;
    chapter?: string;
    chapter_key?: number;
    chapters_amount?: number;
}
