import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss']
})
export class NoteDetailsComponent implements OnInit {

  note: Note;
  noteId: number;
  new: boolean;

  constructor(private notesServce: NotesService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    //find out if we are creating a new note or editing
    this.route.params.subscribe((params: Params) => {
      this.note = new Note();

      if (params.id) {
        this.note = this.notesServce.get(params.id);
        this.noteId = params.id;
        this.new = false;
      } else {
        this.new = true;
      }
    })
  }

  onSubmit(form: NgForm) {
    if (this.new) {
      //save the note
      this.notesServce.add(form.value);
    } else {
      //update the note
      this.notesServce.update(this.noteId, form.value.title, form.value.body);

    }
    this.router.navigateByUrl('/');

  }

  cancel() {
    this.router.navigateByUrl('/');
  }
}
