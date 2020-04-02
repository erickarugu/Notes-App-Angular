import { Injectable } from '@angular/core';
import { Note } from './note.model';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  notes: Note[] = new Array<Note>();


  constructor() { }

  getAll() {
    return this.notes;
  }

  get(id: number) {
    return this.notes[id];
  }
  getId(note: Note) {
    return this.notes.indexOf(note);
  }

  add(note: Note) {
    //add not to t note array and return id where id is equal t indes
    let noteLength = this.notes.push(note);
    let index = noteLength - 1;
    return index;
  }

  update(id: number, title: string, body: string) {
    let note = this.notes[id];
    note.title = title;
    note.body = body;
  }

  delete(id: number) {
    this.notes.splice(id, 1);
  }
}
