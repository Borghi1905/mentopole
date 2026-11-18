# MENTOPOLE 🧠

Plataforma de conscientização sobre saúde mental e inteligência territorial.

O Mentopole é um projeto acadêmico desenvolvido para conectar cidadãos, gestores e administradores, oferecendo informações territoriais, indicadores, serviços de apoio e ferramentas relacionadas à saúde mental.

## 🌐 Acesse o projeto

**Site:** https://mentopole.onrender.com

**GitHub:** https://github.com/Borghi1905/mentopole

## 🎯 Funcionalidades

- Consulta de regiões.
- Visualização de indicadores territoriais.
- Consulta de instituições.
- Consulta de serviços de apoio.
- Registro de relatos dos cidadãos.
- Gerenciamento de categorias e fontes de dados.
- Sistema de autenticação e controle de acesso por perfil.

## 💻 Tecnologias utilizadas

- Java
- Spring Boot
- Spring Web / API REST
- Maven
- Oracle Database
- JDBC
- HikariCP
- HTML5
- CSS3
- JavaScript
- Thymeleaf
- Docker
- Render

## 👥 Contas para demonstração

Contas disponibilizadas para que o professor possa testar os diferentes perfis do sistema.

| Perfil | E-mail | Senha |
|---|---|---|
| Gestor | gestor@gmail.com | gestor123 |
| Cidadão | cidadao@gmail.com | cidadão123 |
| Administrador | administrador@gmail.com | admin123 |

## 📁 Estrutura do projeto

- `bo/` - Regras de negócio.
- `config/` - Configurações da aplicação.
- `controllers/` - Controladores e endpoints da API.
- `dao/` - Acesso ao banco de dados.
- `dto/` - Objetos de transferência de dados.
- `exception/` - Tratamento de exceções.
- `model/` - Modelos e entidades.
- `resources/static/` - Arquivos CSS, JavaScript, áudio e modelos 3D.
- `resources/templates/` - Páginas HTML.

## ⚙️ Como executar localmente

### Pré-requisitos

- Java instalado.
- Maven instalado.
- Acesso ao banco de dados Oracle.

### 1. Clonar o repositório

    git clone https://github.com/Borghi1905/mentopole.git

### 2. Acessar a pasta

    cd mentopole

### 3. Configurar o banco de dados

Criar um arquivo `env` na raiz do projeto com as seguintes variáveis:

    DB_URL=jdbc:oracle:thin:@//HOST:1521/SERVICO
    DB_USERNAME=SEU_USUARIO
    DB_PASSWORD=SUA_SENHA

Substituir os valores pelos dados de acesso ao banco Oracle.

**Importante:** o arquivo `env` contém informações privadas e não deve ser enviado ao GitHub.

### 4. Executar a aplicação

    mvn spring-boot:run

A aplicação ficará disponível em:

http://localhost:8080

## 🐳 Docker

O projeto possui um Dockerfile para criação e execução da aplicação em containers.

Para construir a imagem:

    docker build -t mentopole .

Para executar:

    docker run -p 8080:8080 \
    -e DB_URL="SUA_URL" \
    -e DB_USERNAME="SEU_USUARIO" \
    -e DB_PASSWORD="SUA_SENHA" \
    mentopole

## ☁️ Hospedagem

O projeto está hospedado no Render, com integração ao GitHub e utilização de Docker.

O frontend e a API REST são executados na mesma aplicação Spring Boot.

**Link:** https://mentopole.onrender.com

---

Desenvolvido como projeto acadêmico.

**MENTOPOLE — Tecnologia, informação e conscientização.**