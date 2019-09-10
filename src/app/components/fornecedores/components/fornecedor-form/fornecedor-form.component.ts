import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { trigger, transition, style, animate } from "@angular/animations";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";

@Component({
  selector: "app-fornecedor-form",
  templateUrl: "./fornecedor-form.component.html",
  styleUrls: ["./fornecedor-form.component.scss"],
  animations: [
    trigger("fade", [
      transition("void => *", [style({ opacity: 0 }), animate(500)])
    ])
  ]
})
export class FornecedorFormComponent implements OnInit, AfterViewInit {
  @Input()
  parent: FormGroup;

  @Output()
  cep: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  back: EventEmitter<void> = new EventEmitter<void>();

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
  @ViewChild("nameInput", {static: true}) nameInput;

  constructor() {}

  ngAfterViewInit() {}

  ngOnInit() {
    this.nameInput.nativeElement.focus();

    this.filteredOptions = this.parent
      .get("fornec")
      .get("estado")
      .valueChanges.pipe(
        startWith(""),
        map(value => this._filter(value))
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
}
