import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit
} from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { trigger, transition, style, animate } from "@angular/animations";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { Cliente } from "src/app/models/cliente.model";

@Component({
  selector: "app-cliente-form-edit",
  templateUrl: "./cliente-form-edit.component.html",
  styleUrls: ["./cliente-form-edit.component.scss"],
  animations: [
    trigger("fade", [
      transition("void => *", [style({ opacity: 0 }), animate(500)])
    ])
  ]
})
export class ClienteFormEditComponent implements OnInit {
  editButton = true;
  //arrayClientes = [];

  @Input()
  arrayClientes: string[];

  @Input()
  clientes: Cliente[];

  @Input()
  parent: FormGroup;

  @Input()
  myControl = new FormControl();

  @Output()
  cep: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  back: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  delete: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  save: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  find: EventEmitter<Cliente> = new EventEmitter<Cliente>();

  @Output()
  next: EventEmitter<Cliente> = new EventEmitter<Cliente>();

  @Output()
  previous: EventEmitter<Cliente> = new EventEmitter<Cliente>();

  @Output()
  findOne: EventEmitter<string> = new EventEmitter<string>();

  options: string[] = [
    "AC",
    "AL",
    "AM",
    "AP",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MG",
    "MS",
    "MT",
    "PA",
    "PB",
    "PE",
    "PI",
    "PR",
    "RJ",
    "RN",
    "RO",
    "RR",
    "RS",
    "SC",
    "SE",
    "SP",
    "TO"
  ];
  filteredOptions: Observable<string[]>;
  filteredOptionsFind: Observable<string[]>;

  constructor() {}

  ngOnInit() {
    this.filteredOptions = this.parent
      .get("fornec")
      .get("estado")
      .valueChanges.pipe(
        startWith(""),
        map(value => this._filter(value))
      );

    this.filteredOptionsFind = this.myControl.valueChanges.pipe(
      startWith(""),
      map(value => this._filterFind(value))
    );
  }

  findAdress(cepValue: string) {
    this.cep.emit(cepValue);
  }

  return() {
    this.back.emit();
  }

  private _filter(value: string): string[] {
    let filterValue = "";
    if (value) filterValue = value.toLowerCase();

    return this.options.filter(
      option => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _filterFind(value: string): string[] {
    let filterValue = "";
    if (value) filterValue = value.toLowerCase();

    return this.arrayClientes.filter(
      option => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  changeEditButton() {
    this.editButton = !this.editButton;

    if (!this.editButton) this.parent.get("fornec").enable();
    else this.parent.get("fornec").disable();
  }

  deleteItem() {
    this.delete.emit();
  }

  saveDocument() {
    this.changeEditButton();
  }

  findData(e) {
    this.find.emit(e);
  }

  nextData(e) {
    this.next.emit(e);
  }

  previousData(e) {
    this.previous.emit(e);
  }
}
