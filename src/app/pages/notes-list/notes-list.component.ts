import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  animations: [
    trigger('ItemAnim', [
      //entry animation
      transition('void => *', [
        //set initial state
        style({
          height: 0,
          opacity: 0,
          transform: 'scale(0.85)',
          'margin-bottom': 0,
          //expand out the padding properties
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          paddingLeft: 0,
        }),
        animate('50ms', style({
          height: '*',
          'margin-bottom': '*',
          paddingBottom: '*',
          paddingTop: '*',
          paddingLeft: '*',
          paddingRight: '*'
        })),
        animate(100)
      ]),
      transition('* => void', [
        //scale up
        animate(50, style({
          transform: 'scale(1.05)'
        })),
        animate(50, style({
          transform: 'scale(1)',
          opacity: 0.75
        })),
        animate('120ms ease-out', style({
          opacity: 0,
          transform: 'scale(0.68)'
        })),
        //animate the spacing that is height and amrgin and padding
        animate('150ms ease-out', style({
          height: 0,
          'margin-bottom': 0,
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          paddingLeft: 0,
        }))
      ])
    ]),
    trigger('ListAnim', [
      transition('* => *', [
        query(':enter', [
          style({
            opacity: 0,
            height: 0
          }),
          stagger(100, [
            animate('0.2s ease')
          ])
        ], {
          optional: true
        })
      ])
    ])
  ]
})
export class NotesListComponent implements OnInit {

  notes: Note[] = new Array<Note>();
  filteredNotes: Note[] = new Array<Note>();

  @ViewChild('filterInput', {static: true}) filterInputElRef: ElementRef<HTMLInputElement>;

  constructor(private notesService: NotesService) { }

  ngOnInit() {
    //retrieve all notes
    this.notes = this.notesService.getAll();
    //this.filteredNotes = this.notesService.getAll();
    this.filter('');
  }

  deleteNote(note: Note) {
    let noteId = this.notesService.getId(note);
    this.notesService.delete(noteId);
    this.filter(this.filterInputElRef.nativeElement.value);
  }

  generateNoteURL(note: Note){
    let noteId = this.notesService.getId(note);
    return noteId;
  }

  filter(query: string) {
    query = query.toLowerCase().trim();

    let allResults: Note[] = new Array<Note>();
    //split up the search query nto individual terms
    let terms: string[] = query.split(' ');
    //remove dups
    terms = this.removeDuplicates(terms);
    //compile all relevant results into allResults array
    terms.forEach(term => {
      let results = this.relevantNotes(term);
      //append result to allResults arra
      allResults = [...allResults, ...results];
    });

    let uniqueResults = this.removeDuplicates(allResults);

    this.filteredNotes = uniqueResults;

    //now sort by relevancy
    this.sortByRelevancy(allResults);
  }
  removeDuplicates(arr: Array<any>): Array<any> {
    let uniqueResults: Set<any> = new Set<any>();
    //loop though the array and add items to the set
    arr.forEach(e => uniqueResults.add(e));

    return Array.from(uniqueResults);
  }

  relevantNotes(query: string): Array<Note> {
    query = query.toLowerCase().trim();
    let relevantNotes = this.notes.filter(note => {
      if (note.title && note.title.toLowerCase().includes(query)) {
        return true;
      }
      if(note.body && note.body.toLowerCase().includes(query)){
        return true;
      }
      return false;
    })

    return relevantNotes;
  }

  sortByRelevancy(searchResults: Note[]){
    //calculate the relevancy based on the number of times it appears on the search results
    let noteCountObj: Object = {}; //format key: value => Noteid: number (note on=bject id : count)

    searchResults.forEach(note => {
      let noteId = this.notesService.getId(note); //get the notes id

      if(noteCountObj[noteId]){
        noteCountObj[noteId] += 1;
      }else{
        noteCountObj[noteId] = 1 ;
    }
    })
    this.filteredNotes = this.filteredNotes.sort((a: Note, b: Note) =>{
      let aId = this.notesService.getId(a);
      let bId = this.notesService.getId(b);

      let aCount = noteCountObj[aId];
      let bCount = noteCountObj[bId];

      return bCount - aCount;
;
    })
  }
}
