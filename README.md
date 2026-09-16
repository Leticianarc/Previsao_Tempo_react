# Previsão do Tempo

Aplicação web que exibe as condições atuais e a previsão de 5 dias para qualquer cidade do mundo.
Construída em **React + TypeScript**, sem chave de API e sem dependências além do React.

![React](https://img.shields.io/badge/React-19-087ea4?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white)

> 🔁 **Este projeto existe em duas versões.** Esta é a reconstrução em React e TypeScript do
> meu projeto original em HTML, CSS e JavaScript puro, que segue publicado em
> **[previsao-tempo-js](https://github.com/Leticianarc/previsao-tempo-js)**.
>
> O que mudou de uma para a outra:
>
> | | JavaScript puro | React + TypeScript |
> | --- | --- | --- |
> | Interface | `innerHTML` e `querySelector` | Componentes reutilizáveis |
> | Tipos | Nenhum | TypeScript em modo estrito |
> | Requisições | Chamadas direto na tela | Camada de API isolada e tipada |
> | Busca concorrente | Última resposta sobrescreve | Cancelada com `AbortController` |
> | Erros | Mensagem única | Estados `idle`/`loading`/`success`/`error` |

## Funcionalidades

- Busca de cidades por nome, com geocodificação automática
- Temperatura atual, sensação térmica, umidade e velocidade do vento
- Previsão de máxima e mínima para os próximos 5 dias
- Tema claro e escuro, seguindo a preferência do sistema
- Layout responsivo, do celular ao desktop

## Decisões técnicas

Algumas escolhas que vão além do "fazer funcionar":

- **TypeScript em modo estrito**, incluindo `noUncheckedIndexedAccess`. A API devolve os dias como arrays
  paralelos (`time[]`, `temperature_2m_max[]`…); o código trata explicitamente a possibilidade de um índice
  não existir em vez de deixar `NaN` chegar na tela.
- **Camada de API isolada** (`services/weatherApi.ts`). Os componentes não sabem o formato cru da resposta:
  a conversão para os tipos do domínio acontece em um lugar só.
- **Cancelamento de requisições concorrentes.** Cada busca aborta a anterior com `AbortController`, então
  uma resposta lenta nunca sobrescreve o resultado de uma busca mais recente.
- **Estados explícitos** (`idle`, `loading`, `success`, `error`). "Cidade não encontrada" é um estado
  previsto da interface, não uma exceção genérica.
- **Acessibilidade**: `role="search"`, rótulos associados aos campos, `aria-label` descrevendo cada ícone
  de clima e foco visível em todos os controles.

## Rodando localmente

```bash
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

Para gerar a build de produção:

```bash
npm run build
npm run preview
```

## Estrutura

```
src/
├── components/     # Componentes de apresentação
│   ├── SearchBar.tsx
│   ├── CurrentWeather.tsx
│   └── ForecastList.tsx
├── hooks/
│   └── useWeather.ts       # Fluxo de busca e estados da requisição
├── services/
│   └── weatherApi.ts       # Comunicação com a API e tipagem das respostas
├── utils/
│   └── weatherCodes.ts     # Tradução dos códigos WMO e formatações
├── types.ts                # Tipos do domínio
├── App.tsx
└── main.tsx
```

## Stack

React 19 · TypeScript · Vite · CSS puro (custom properties)

Dados meteorológicos fornecidos pela [Open-Meteo](https://open-meteo.com), gratuita e sem necessidade de
cadastro ou chave de API.
