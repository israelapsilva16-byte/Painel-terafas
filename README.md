# Fluxo — Meu Painel de Tarefas

Fluxo é um aplicativo simples de lista de tarefas (to-do list) feito com **HTML, CSS e JavaScript puro** (sem frameworks, sem backend). Todos os dados ficam salvos no navegador do próprio usuário, usando `localStorage`.

## ✨ Funcionalidades

- Adicionar tarefas com título, data, prioridade (baixa/média/alta) e categoria
- Marcar tarefas como concluídas
- Editar tarefas existentes (título, data, prioridade e categoria)
- Excluir tarefas individualmente
- Limpar todas as tarefas concluídas de uma vez
- Filtros: Todas, Pendentes, Concluídas, Hoje, Atrasadas
- Busca por texto (título ou categoria)
- Reordenar tarefas arrastando (drag and drop)
- Estatísticas em tempo real (total, pendentes, concluídas, atrasadas) e barra de progresso
- Tema claro/escuro, com preferência salva
- Layout responsivo (funciona em celular)
- Os dados persistem entre sessões (ficam salvos no navegador via `localStorage`)

## 🗂️ Estrutura de arquivos

```
fluxo/
├── index.html   → estrutura da página
├── style.css    → estilos visuais (cores, layout, tema claro/escuro)
└── script.js    → toda a lógica (adicionar, editar, excluir, filtrar, salvar)
```

## 🚀 Como usar localmente

Não precisa instalar nada. Basta:

1. Baixar os três arquivos (`index.html`, `style.css`, `script.js`) e colocá-los **na mesma pasta**.
2. Dar duplo clique em `index.html` para abrir no navegador.

Pronto — o app já funciona.

> ⚠️ Importante: os três arquivos precisam estar na mesma pasta e com esses nomes exatos (`index.html`, `style.css`, `script.js`), senão a página não vai encontrar o CSS/JS.

## 📱 Funciona no celular?

Sim. O layout é responsivo: em telas pequenas, a barra lateral vira um cabeçalho compacto no topo, os filtros aparecem como botões e os cards se reorganizam para caber na tela. Todas as funções (adicionar, marcar, editar, excluir, filtrar, buscar) funcionam normalmente pelo navegador do celular.

O processo de publicar no GitHub (próxima seção) também pode ser feito inteiramente pelo navegador do celular, sem precisar de computador.

## 🌐  Tecnologias usadas

- HTML5
- CSS3 (variáveis CSS para o tema claro/escuro, Flexbox e Grid)
- JavaScript (Vanilla JS, sem bibliotecas externas)
- `localStorage` do navegador para salvar os dados (não usa banco de dados nem servidor)

## 💾 Onde ficam os dados?

Tudo é salvo localmente no navegador, nas chaves:
- `taskflow_tasks` → lista de tarefas
- `taskflow_theme` → tema escolhido (claro/escuro)

> Essas chaves internas mantêm o nome `taskflow_` por baixo dos panos (é só um identificador técnico no código, não aparece na tela); não afeta o funcionamento do app.

Isso significa que:
- Os dados **não são compartilhados entre navegadores diferentes** nem entre dispositivos diferentes.
- Se você limpar os dados de navegação/cookies do navegador, as tarefas somem.
- Não existe login nem conta de usuário — é tudo local.

## 📄 Licença

Este projeto está sob a licença **MIT** — você pode usar, copiar, modificar e distribuir livremente, inclusive para fins comerciais, desde que mantenha o aviso de direitos autorais original. Veja o arquivo [LICENSE](./LICENSE) para o texto completo.

**Aviso de responsabilidade:** este projeto é fornecido gratuitamente, "como está", sem nenhum tipo de garantia. O autor não se responsabiliza por quaisquer danos, perdas de dados ou problemas decorrentes do uso deste software.
