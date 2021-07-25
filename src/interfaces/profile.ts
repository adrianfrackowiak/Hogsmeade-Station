export default interface IProfile {
    firstName?: string;
    lastName?: string;
    email?: string;
    house?: string;
    bookstrack?: Book;
    favorites?: Favorites;
}

interface Book {
    id?: number;
    title?: string;
    chapter?: string;
    chapter_key?: number;
    chapters_amount?: number;
}

interface Favorites {
    wizard: string;
    place: string;
    spell: string;
}
