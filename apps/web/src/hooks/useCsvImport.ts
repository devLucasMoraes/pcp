import Papa from 'papaparse'
import { useCallback } from 'react'

import { parseDate } from '../util/time-utils'

export interface CsvRow {
  dataInicio: Date
  dataFim: Date
  duracao: string
  ocorrenciaDescricao: string
  qtdeApontada: number
  tiragem: number
  codOP: string
  descricao: string
  nomeCliente: string
  valorServico: string
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

interface PapaParseResult {
  data: string[][]
  errors: Papa.ParseError[]
  meta: Papa.ParseMeta
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
            Papa.parse<string[]>(text, {
              delimiter: ',',
              quoteChar: '"',
              escapeChar: '"',
              header: false,
              skipEmptyLines: true,
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

          if (!Array.isArray(row) || row.length < 12) {
            const error = `Linha ${i + 1}: esperadas 12 colunas, encontradas ${row?.length || 0}`
            onValidationError?.(error)
            continue
          }

          try {
            const tiragem = Number(row[5])
            const qtdeApontada = Number(
              row[4]?.replace(/\./g, '').replace(',', '.'),
            )

            if (isNaN(tiragem) || isNaN(qtdeApontada)) {
              onValidationError?.(
                `Linha ${i + 1}: valores numéricos inválidos (qtdeApontada: ${row[4]}, quantidade: ${row[5]}, código: ${row[6]})`,
              )
              continue
            }

            parsedData.push({
              dataInicio: parseDate(row[0]),
              dataFim: parseDate(row[1]),
              duracao: row[2] || '',
              ocorrenciaDescricao: row[3] || '',
              qtdeApontada,
              tiragem,
              codOP: row[6] || '',
              descricao: row[7] || '',
              nomeCliente: row[8] || '',
              valorServico: row[9] || '',
              operadorNome: row[10] || '',
              equipamentoNome: row[11] || '',
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
