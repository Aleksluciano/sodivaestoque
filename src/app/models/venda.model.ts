export interface Venda {
  id?: string;
  clienteId: string;
  clienteNome: string;
  clienteEndereco: string;
  clienteTelefone: string;
  recibo: string;
  data: Date;
  mes: number;
  ano: number;
  desconto: number;
  listaProduto: any[];
  tipoPagamento: string;
  vezes: string;
  divisaoPagamento: any[];
  valor: number;
  quantidadeTotal: number;
  dataPrimeiroPag: Date;
  dataUltimoPag: Date;
  forma: string;
}
