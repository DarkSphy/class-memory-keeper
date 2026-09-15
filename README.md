# Simbi: Your Teaching Memory

Quero construir o MVP de uma aplicação web mobile-first chamada Simbi.

A Simbi é uma ferramenta pessoal para professores organizarem a memória pedagógica de suas turmas. Ela NÃO é um sistema escolar, diário oficial, ERP escolar ou sistema de secretaria. Não deve ter matrícula, boletim oficial, financeiro, comunicação com responsáveis ou gestão institucional.

Objetivo principal do MVP:
Permitir que um professor registre rapidamente o que aconteceu em cada aula e consiga recuperar depois informações importantes sobre turmas e alunos.

Quero uma aplicação simples, elegante, extremamente rápida de usar e pensada prioritariamente para celular.

TECNOLOGIA E ESCOPO

Use a stack padrão já disponível no projeto.

Não implemente integrações externas neste momento.

Não implemente APIs de IA.

Não implemente transcrição de áudio real.

Não implemente pagamentos.

Não implemente notificações push.

Não implemente funcionalidades extras além das descritas abaixo.

Priorize uma arquitetura limpa e componentes reutilizáveis.

FUNCIONALIDADES DO MVP

AUTENTICAÇÃO

Criar fluxo simples de login e cadastro.

Cada usuário deve visualizar apenas seus próprios dados.

TURMAS

O professor deve conseguir:

criar uma turma;

editar turma;

excluir turma;

visualizar lista de turmas.

Campos:

nome da turma, exemplo: "8º B";

disciplina;

série/ano;

observação opcional.

Na tela da turma mostrar:

último conteúdo registrado;

última aula registrada;

quantidade de alunos;

pendências recentes;

observações recentes;

botão principal "Registrar aula".

ALUNOS

Dentro de cada turma, permitir:

adicionar aluno;

editar aluno;

excluir aluno;

visualizar alunos.

Manter poucos dados.

Campos:

nome ou apelido;

observação opcional.

Não pedir CPF, data de nascimento, telefone, endereço ou dados familiares.

REGISTRO DE AULA

Essa é a função mais importante da aplicação.

O professor entra em uma turma e toca em "Registrar aula".

Criar formulário extremamente rápido com:

data;

conteúdo trabalhado;

status do conteúdo: concluído, parcial ou não concluído;

percepção geral da turma: boa, média ou difícil;

campo livre "O que aconteceu na aula?";

alunos relacionados ao registro;

pendência para próxima aula, opcional.

O professor deve conseguir selecionar um ou vários alunos relacionados ao registro.

Exemplo:

Conteúdo: Frações equivalentes
Status: Parcial
Turma: Média
Registro: "A turma teve dificuldade na simplificação. Ana melhorou bastante e João estava disperso."
Alunos relacionados: Ana e João
Pendência: Exercícios 7 e 8.

Salvar tudo associado à turma.

MEMÓRIA DA TURMA

A tela de uma turma deve funcionar como uma memória pedagógica.

Mostrar:

último conteúdo;

última aula;

pendências atuais;

histórico cronológico de registros;

alunos mencionados recentemente;

dificuldades ou observações recentes.

Criar uma seção chamada "Antes da próxima aula" mostrando de forma resumida:

onde o professor parou;

o que ficou pendente;

quais alunos apareceram nos últimos registros;

últimas observações importantes.

Não usar IA real para isso por enquanto. Gerar esse resumo usando apenas os dados salvos mais recentes.

MEMÓRIA DO ALUNO

Ao abrir um aluno, mostrar:

nome;

turma;

histórico cronológico de todos os registros em que esse aluno foi relacionado;

data;

conteúdo da aula;

observação feita naquela aula.

Objetivo:
permitir que o professor veja rapidamente a evolução e o histórico daquele aluno.

TELA "SIMBI"

Criar uma tela chamada "Simbi".

Por enquanto NÃO conectar IA.

Ela deve funcionar como uma interface preparada para futura IA.

Criar um campo com placeholder:

"Pergunte algo sobre suas turmas..."

E mostrar exemplos:

"Onde parei no 8º B?"

"Quais alunos apareceram mais vezes nos meus registros?"

"O que ficou pendente no 7º A?"

"Como está o histórico da Ana?"

Nesta versão, criar apenas uma interface visual e uma mensagem explicando que essa função será habilitada futuramente.

TELA INICIAL

Criar dashboard simples chamado "Hoje".

Mostrar:

turmas acessadas recentemente;

últimas aulas registradas;

pendências;

botão grande "Registrar aula".

Evitar dashboards cheios de gráficos.

A proposta deve ser simplicidade e velocidade.

NAVEGAÇÃO

Usar navegação mobile-first com quatro áreas principais:

Hoje

Turmas

Alunos

Simbi

No desktop pode adaptar para sidebar.

DESIGN

Quero uma interface:

minimalista;

moderna;

leve;

profissional;

acolhedora;

focada em professores;

sem aparência de sistema escolar burocrático.

Evitar tabelas complexas.

Preferir cards, listas, chips e ações rápidas.

Dar bastante destaque ao botão "Registrar aula".

A interface deve funcionar muito bem em smartphones.

IMPORTANTE SOBRE POSICIONAMENTO

A Simbi deve parecer uma ferramenta pessoal do professor, não uma plataforma da escola.

Não usar linguagem como:

gestão escolar;

secretaria;

matrícula;

boletim oficial;

sistema acadêmico.

Usar linguagem como:

memória da turma;

registro da aula;

acompanhamento;

observações;

pendências;

rotina docente.

BANCO DE DADOS

Criar estrutura mínima para:

users;

classes/turmas;

students/alunos;

lesson_records/registros de aula;

relação entre registros e alunos.

Garantir que os dados estejam vinculados ao usuário autenticado.

DADOS DE DEMONSTRAÇÃO

Criar alguns dados fictícios para facilitar visualização:

Turma: 8º B
Disciplina: Matemática

Alunos:
Ana
João
Carlos
Mariana

Adicionar 2 ou 3 registros de aula simulados.

RESTRIÇÃO FINAL

Não adicionar funcionalidades que não foram solicitadas.

Quero primeiro um MVP funcional e enxuto.

Prioridades absolutas:

Turmas

Alunos

Registro de aula

Memória da turma

Memória individual do aluno

Boa experiência mobile

Se alguma funcionalidade ficar muito grande, priorize essas seis antes de qualquer outra coisa. DIREÇÃO VISUAL — MUITO IMPORTANTE

Quero que a Simbi tenha aparência de produto digital projetado por uma equipe de design real, e não aparência de interface gerada por IA ou baseada em template genérico.

Evite completamente os padrões visuais comuns de aplicações geradas por IA:

não usar gradientes decorativos;

não usar glassmorphism;

não usar sombras excessivas;

não usar cards para absolutamente tudo;

não usar ícones genéricos em excesso;

não usar elementos flutuantes sem função;

não usar dashboards cheios de métricas artificiais;

não usar textos promocionais dentro da interface;

não usar roxo/azul neon como linguagem padrão de “produto com IA”;

não usar excesso de bordas arredondadas;

não usar grandes áreas vazias apenas para parecer moderno;

não criar uma interface com aparência de template SaaS genérico.

A Simbi deve ter uma identidade visual sóbria, humana, editorial e funcional.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://class-memory-keeper.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a7815b43-130f-4275-972b-04af8730828e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
