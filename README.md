# mycolection_with_sdd
gerenciamento de colecao utilizando técnica de desenvolvimento SDD


** Cenário
Precisa que seja desenvolvido um aplicativo de controle de acervo (livros, quadrinhos, mangás e jogos) com sistema de empréstimo e fila de espera.
Cada item pode ter:
Um identificador único.
Um nome 
tipo de mídia
uma ou mais categorias
data de retirada 
data de devolucao (1 mes apos retirada)
Atributos opcionais (como descrição ou tags).

Objetivo
Criar a base para a aplicação (front e back), com funcionalidades básicas.

Critérios funcionais
Arquitetura deve ser simples e limpa;
Código deve ser escrito em Java utilizando Spring e Gradle
Utilizar banco de dados local (h2)
Deve conter testes

Critérios de sucesso
Implementar um CRUD completo para a gestão de itens, cumprindo os seguintes requisitos:
*Listar itens com filtro de categoria
 A partir dessa lista completa, implemente um novo filtro para listar os itens por categoria e adicione paginação aos resultados.
*Modificar item existente: desenvolva a funcionalidade para atualizar os dados de um item. Deve ser possível atualizar o nome, a categoria e a descrição de um item.
*Excluir item: implemente a operação que permita remover um item do sistema.
*Criar novo item: adicione a capacidade de criar e registrar um novo item no banco de dados.
A aplicação é executada corretamente no ambiente local por meio de Docker.
A aplicação deve conter um front simples sem login.


