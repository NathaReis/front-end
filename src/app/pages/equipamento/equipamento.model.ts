export interface EquipamentDto {
  id?: number; //number gerado pelo sistema
  number: string; //string(100)
  ownership: string; //string(20)
  qrCode: string; //string(1000) gerado automaticamente
}

// Detalhes dos Campos
// id

// Tipo: Long
// Anotação: @Id, @GeneratedValue(strategy = GenerationType.IDENTITY)
// Descrição: Identificador único do equipamento. É gerado automaticamente pelo banco de dados.
// number

// Tipo: String
// Anotação: @Column(name = "number", length = 100)
// Descrição: Número ou nome do equipamento.
// Tamanho Máximo: 100 caracteres
// Obrigatoriedade: Não especificado, mas no método create da classe EquipamentService, é verificado se é nulo ou vazio, então é obrigatório.
// ownership

// Tipo: String
// Anotação: @Column(name = "ownership", length = 20)
// Descrição: Nome ou número do proprietário do equipamento.
// Tamanho Máximo: 20 caracteres
// Obrigatoriedade: Não especificado, mas no método create da classe EquipamentService, é verificado se é nulo ou vazio, então é obrigatório.
// qrCode

// Tipo: String
// Anotação: @Column(name = "qr_code", length = 1000)
// Descrição: Código QR associado ao equipamento.
// Tamanho Máximo: 1000 caracteres
// Obrigatoriedade: Não especificado, mas é gerado automaticamente no método create da classe EquipamentService.