export interface Produto {
  id?: string;
  codigo: string;
  descricao: string;
  fornecedor: string;
  // codigofornecedor: string,
  data: Date;
  cor: string;
  tipo: string;
  tamanho: string;
  quantidade: number;
  valor: number;
  // custo: number,
  preco: number;
  estoque: any[];
  // lucrobruto: number
}



