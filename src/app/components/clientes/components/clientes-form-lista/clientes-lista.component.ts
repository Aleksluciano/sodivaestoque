import { Cliente } from "./../../../../models/cliente.model";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener
} from "@angular/core";
import {
  trigger,
  sequence,
  animate,
  transition,
  style
} from "@angular/animations";
import {MatTableDataSource } from "@angular/material";

const rowsAnimation = trigger("rowsAnimation", [
  transition("void => *", [
    style({
      height: "*",
      opacity: "0",
      transform: "translateX(-550px)",
      "box-shadow": "none"
    }),
    sequence([
      animate(
        ".35s ease",
        style({
          height: "*",
          opacity: ".2",
          transform: "translateX(0)",
          "box-shadow": "none"
        })
      ),
      animate(
        ".35s ease",
        style({ height: "*", opacity: 1, transform: "translateX(0)" })
      )
    ])
  ])
]);

const fadeAnimation = trigger("fade", [
  transition("void => *", [style({ opacity: 0 }), animate(500)])
]);
@Component({
  selector: "app-clientes-lista",
  templateUrl: "./clientes-lista.component.html",
  styleUrls: ["./clientes-lista.component.scss"],
  animations: [rowsAnimation, fadeAnimation]
})
export class ClientesListaComponent implements OnInit {
  @Input()
  displayedColumns: string[] = [];

  @Input()
  clientes: MatTableDataSource<Cliente>;

  @Output()
  delete: EventEmitter<Cliente> = new EventEmitter<Cliente>();

  @Output()
  edit: EventEmitter<Cliente> = new EventEmitter<Cliente>();

  @Output()
  filter: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  newItem: EventEmitter<void> = new EventEmitter<void>();

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log(event)
    if ((event.which == 13 || event.keyCode == 13)) {
        event.preventDefault();
        this.callNewItemForm();
    }
  }

  constructor() {}

  ngOnInit() {}

  deleteRow(cliente: Cliente) {
    this.delete.emit(cliente);
  }

  editRow(cliente: Cliente) {
    this.edit.emit(cliente);
  }

  onKeyup(filter: string) {

    this.filter.emit(filter);
  }

  callNewItemForm(){
    this.newItem.emit();
  }
}
