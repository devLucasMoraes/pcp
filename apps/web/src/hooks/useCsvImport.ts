import Papa from 'papaparse'
import { useCallback } from 'react'

import { converterMoedaParaNumber } from '../util/str-utils'
import { parseDate } from '../util/time-utils'

export interface CsvRow {
  dataInicio: Date
  dataFim: Date
  duracao: string
  ocorrenciaDescricao: string
  qtdeApontada: number
  tiragem: number
  codOP: string
  codOperador: string
  codEquipamento: string
  descricao: string
  nomeCliente: string
  valorServico: number
  operadorNome: string
  equipamentoNome: string
}

export interface UseCsvImportOptions {
  onSuccess?: (data: CsvRow[]) => void
  onError?: (error: string) => void
  onValidationError?: (error: string) => void
}

export interface UseCsvImportReturn {
  parseCsvFile: (file: File) => Promise<CsvRow[] | null>
  isValidCsvFile: (file: File) => boolean
}

interface CsvRowData {
  DataIni: string
  DataFim: string
  DURACAO: string
  OCORRENCIA: string
  QuantidadeApontada: string
  TIRAGEM: string
  CODIGOOP: string
  DESCRICAOOP: string
  NOMECLIENTE: string
  CODIGOOPERADOR: string
  OPERADOR: string
  ValorTotal: string
  CODIGOEQUIPAMENTO: string
  DESCRICAOEQUIPAMENTO: string
}

interface PapaParseResult {
  data: CsvRowData[]
  errors: Papa.ParseError[]
  meta: Papa.ParseMeta
}

// Mapeamento dos headers do CSV para as propriedades da interface
const HEADER_MAPPING: Record<string, string> = {
  DataIni: 'dataInicio',
  DataFim: 'dataFim',
  DURACAO: 'duracao',
  OCORRENCIA: 'ocorrenciaDescricao',
  QuantidadeApontada: 'qtdeApontada',
  TIRAGEM: 'tiragem',
  CODIGOOP: 'codOP',
  DESCRICAOOP: 'descricao',
  NOMECLIENTE: 'nomeCliente',
  CODIGOOPERADOR: 'codOperador',
  OPERADOR: 'operadorNome',
  ValorTotal: 'valorServico',
  CODIGOEQUIPAMENTO: 'codEquipamento',
  DESCRICAOEQUIPAMENTO: 'equipamentoNome',
}

export const useCsvImport = (
  options: UseCsvImportOptions = {},
): UseCsvImportReturn => {
  const { onSuccess, onError, onValidationError } = options

  const isValidCsvFile = useCallback((file: File): boolean => {
    if (!file) return false

    const isCsvExtension = file.name.toLowerCase().endsWith('.csv')
    const isCsvMimeType =
      file.type === 'text/csv' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'text/plain'

    return isCsvExtension || isCsvMimeType
  }, [])

  const parseCsvFile = useCallback(
    async (file: File): Promise<CsvRow[] | null> => {
      try {
        if (!isValidCsvFile(file)) {
          const error = 'Por favor, selecione um arquivo CSV válido'
          onValidationError?.(error)
          return null
        }

        const text = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            const result = e.target?.result
            if (typeof result === 'string') {
              resolve(result)
            } else {
              reject(new Error('Erro ao ler o arquivo: resultado não é string'))
            }
          }
          reader.onerror = () => reject(new Error('Erro ao ler o arquivo'))
          reader.readAsText(file, 'UTF-8')
        })

        const results = await new Promise<PapaParseResult>(
          (resolve, reject) => {
            Papa.parse<CsvRowData>(text, {
              delimiter: ';',
              quoteChar: '"',
              escapeChar: '"',
              header: true,
              skipEmptyLines: true,
              transformHeader: (header: string) => header.trim(),
              transform: (value: string) => value.trim(),
              complete: (results) => resolve(results as PapaParseResult),
              error: (error: Error) => reject(error),
            })
          },
        )

        if (results.errors && results.errors.length > 0) {
          const errorMessages = results.errors
            .map((e) => `Linha ${e.row || 'desconhecida'}: ${e.message}`)
            .join('\n')

          const error = `Erros no parsing CSV:\n${errorMessages}`
          onValidationError?.(error)
          return null
        }

        if (!results.data || !Array.isArray(results.data)) {
          onValidationError?.('Dados do CSV não encontrados')
          return null
        }

        const parsedData: CsvRow[] = []

        for (let i = 0; i < results.data.length; i++) {
          const row = results.data[i]

          if (!row || typeof row !== 'object') {
            const error = `Linha ${i + 1}: dados inválidos`
            onValidationError?.(error)
            continue
          }

          try {
            // Verifica se as colunas essenciais existem
            const requiredHeaders = Object.keys(HEADER_MAPPING)
            const missingHeaders = requiredHeaders.filter(
              (header) => !(header in row),
            )

            if (missingHeaders.length > 0) {
              onValidationError?.(
                `Linha ${i + 1}: colunas ausentes: ${missingHeaders.join(', ')}`,
              )
              continue
            }

            const tiragem = Number(row.TIRAGEM)
            const qtdeApontada = Number(
              row.QuantidadeApontada?.replace(/\./g, '').replace(',', '.') ||
                '0',
            )

            if (isNaN(tiragem) || isNaN(qtdeApontada)) {
              onValidationError?.(
                `Linha ${i + 1}: valores numéricos inválidos (qtdeApontada: ${row.QuantidadeApontada}, tiragem: ${row.TIRAGEM})`,
              )
              continue
            }

            console.log({ row })

            parsedData.push({
              dataInicio: parseDate(row.DataIni),
              dataFim: parseDate(row.DataFim),
              duracao: row.DURACAO || '',
              ocorrenciaDescricao: row.OCORRENCIA || '',
              qtdeApontada,
              tiragem,
              codOP: row.CODIGOOP || '',
              descricao: row.DESCRICAOOP || '',
              nomeCliente: row.NOMECLIENTE || '',
              codOperador: row.CODIGOOPERADOR || '',
              operadorNome: row.OPERADOR || '',
              valorServico: converterMoedaParaNumber(row.ValorTotal || ''),
              codEquipamento: row.CODIGOEQUIPAMENTO || '',
              equipamentoNome: row.DESCRICAOEQUIPAMENTO || '',
            })
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Erro ao processar linha'
            onValidationError?.(`Linha ${i + 1}: ${errorMessage}`)
          }
        }

        if (parsedData.length === 0) {
          onValidationError?.('Nenhum dado válido encontrado no CSV')
          return null
        }

        onSuccess?.(parsedData)
        return parsedData
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Erro desconhecido ao processar CSV'

        onError?.(errorMessage)
        return null
      }
    },
    [isValidCsvFile, onSuccess, onError, onValidationError],
  )

  return {
    parseCsvFile,
    isValidCsvFile,
  }
}
