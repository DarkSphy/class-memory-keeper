# Plano do MVP Simbi

## Resultado
Uma aplicação mobile-first, enxuta e funcional para professores registrarem aulas e recuperarem a memória pedagógica de turmas e alunos, com acesso seguro e dados privados por usuário.

## Estrutura do produto
- Criar acesso e cadastro por e-mail/senha e Google, incluindo confirmação por e-mail, recuperação de senha e saída segura.
- Criar perfil básico do professor com nome de exibição.
- Organizar a navegação principal em **Hoje**, **Turmas**, **Alunos** e **Simbi**, com barra inferior no celular e barra lateral no desktop.
- Fazer da tela **Hoje** um resumo direto: turmas recentes, últimas aulas, pendências e ação principal para registrar aula.

## Turmas e alunos
- Permitir criar, editar, excluir e listar turmas com nome, disciplina, série/ano e observação.
- Criar a página de memória da turma com último conteúdo, última aula, quantidade de alunos, pendências, observações e histórico cronológico.
- Montar **Antes da próxima aula** a partir dos registros recentes, sem IA.
- Permitir criar, editar, excluir e listar alunos com nome/apelido e observação.
- Criar a memória individual do aluno com todos os registros relacionados em ordem cronológica.

## Registro de aula
- Criar um fluxo rápido por turma com data, conteúdo, status, percepção geral, relato livre, seleção de vários alunos e pendência opcional.
- Dar destaque visual e acesso rápido à ação **Registrar aula** nas telas principais.
- Atualizar automaticamente as memórias da turma e dos alunos após cada registro.

## Tela Simbi
- Criar a interface preparada para uma futura assistente, com campo de pergunta, exemplos solicitados e aviso claro de indisponibilidade nesta versão.
- Não conectar IA, áudio, pagamentos, notificações ou serviços externos.

## Dados e segurança
- Criar as estruturas de perfis, turmas, alunos, registros de aula e relação registro–aluno.
- Aplicar regras para que cada professor veja e altere apenas os próprios dados.
- Gerar automaticamente o perfil básico no cadastro.
- Disponibilizar a turma 8º B, seus quatro alunos e registros simulados como dados de demonstração para novas contas, sem misturar dados entre usuários.

## Direção visual
- Interface editorial, sóbria, humana e acolhedora, com tipografia legível e hierarquia forte.
- Paleta clara e natural com contraste profissional, sem gradientes, neon, glassmorphism ou sombras excessivas.
- Poucos blocos delimitados; priorizar listas, divisores, chips e áreas de ação.
- Cantos discretos, controles grandes para toque e densidade equilibrada em telas pequenas.

## Detalhes técnicos
- Usar o framework e os componentes já presentes no projeto.
- Persistir os dados no Lovable Cloud com regras de acesso por usuário.
- Implementar páginas protegidas, estados vazios, carregamento, erros e confirmações de exclusão.
- Criar metadados próprios para cada página e validar o fluxo principal em celular e desktop.
