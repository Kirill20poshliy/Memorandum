import { makeAutoObservable } from "mobx";
import type { INote } from "../models/note";
import dayjs from "dayjs";

class FilterStore {
    searchString: string = ""

    constructor() {
        makeAutoObservable(this)
    }

    setSearchString(value: string) {
        this.searchString = value
    }

    searchHandler(item: INote) {
        return (item.title.toLowerCase().includes(this.searchString.toLowerCase()) ||
            item.text.toLowerCase().includes(this.searchString.toLowerCase()) ||
            dayjs(item.createdAt.toDate()).format("DD.MM.YYYY HH:mm").includes(this.searchString))
    }
}

export default new FilterStore()