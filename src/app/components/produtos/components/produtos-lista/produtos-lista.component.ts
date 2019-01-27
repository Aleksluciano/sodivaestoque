import { Produto } from "./../../../../models/produto.model";
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
import { MatTableDataSource } from "@angular/material";

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
  selector: "app-produtos-lista",
  templateUrl: "./produtos-lista.component.html",
  styleUrls: ["./produtos-lista.component.scss"],
  animations: [rowsAnimation, fadeAnimation]
})
export class ProdutosListaComponent implements OnInit {
  @Input()
  footerQuantidade: Number;

  @Input()
  footerCustoTotal: Number;

  @Input()
  footerLucroTotal: Number;

  @Input()
  footerLucroPorcentagem: Number;

  @Input()
  footerValorPago: Number;

  @Input()
  footerPrecoVenda: Number;

  @Input()
  displayedColumns: string[] = [];

  @Input()
  produtos: MatTableDataSource<Produto>;

  @Output()
  delete: EventEmitter<Produto> = new EventEmitter<Produto>();

  @Output()
  edit: EventEmitter<Produto> = new EventEmitter<Produto>();

  @Output()
  filter: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  newItem: EventEmitter<void> = new EventEmitter<void>();

  @HostListener("document:keypress", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.which == 13 || event.keyCode == 13) {
      event.preventDefault();
      this.callNewItemForm();
    }
  }

  constructor() {}

  ngOnInit() {}

  deleteRow(produto: Produto) {
    this.delete.emit(produto);
  }

  editRow(produto: Produto) {
    this.edit.emit(produto);
  }

  onKeyup(filter: string) {
    this.filter.emit(filter);
  }

  callNewItemForm() {
    this.newItem.emit();
  }
}
