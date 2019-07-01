# Comigo API Framework!

*Comigo API* é um framework responsável por todo gerenciamento da camada de banco de dados, variáveis de ambiente, testes, logs, envio de emails e gerenciamento de dependências, para que micro serviços desenvolvidos na Comigo Saúde utilizem e foquem apenas em regras de negócios. 

## Configuração

realize o clone do framework:
`git clone https://github.com/comigo-saude/api-comigo.git`.

realize a instalação das dependências com o comando:
`npm install`

caso o serviço já exista basta realizar um clone na raiz do framework:
**Ex.** `git clone https://github.com/comigo-saude/api-comigo-finance.git`

para que as regras de negocio funcionem, crie uma pasta na raiz com o nome do serviço, o nome da pasta será no *service-name* da aplicação.
**Ex.** `mkdir api-comigo-finance`

a estrutura do serviço deve conter os seguintes diretórios:

`src/controllers`
* files.js

`src/ docs`
* arquivos de documentação (Postman, Swagger)

`src/models`
* /queries
* /validations
* models.js

`src/routes`
* files.js

`src/test`
* files.js 

configurações de conexões com o banco de dados do serviço utilize o ambiente adequado configurando os acessos em:
* `service-name/config/env/.env.development`
* `service-name/config/env/.env.homolog`
* `service-name/config/env/.env.production`

Assim que o serviço estiver configurado adicione o nome da pasta do serviço no arquivo **.gitignore** do framework.

para levantar o servidor vá ao diretório do framework e inicie-o com `npm start`.

para executar testes execute `npm test`.

para melhorar a qualidade de seu código no desenvolvimento dos serviços utilize `gulp eslint`.
