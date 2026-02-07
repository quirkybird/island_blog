---
title: "Docker 学习笔记：从入门到实践"
date: 2024-01-01
tags: []
categories: ["tech_blog"]
author: "quirkybird"
---

> 本文部分内容由AI生成整理

### 1. Docker 是什么？

Docker 是一个开源的应用容器引擎，它允许开发者将应用及其依赖打包到一个可移植的容器中，然后发布到任何流行的 Linux 或 Windows 机器上，也可以实现虚拟化。容器是完全使用沙箱机制，相互之间不会有任何接口。

可以将其想象成一个标准化的“集装箱”，无论里面装的是什么（应用程序和其所有依赖项），都可以被轻松地运输（部署）到任何地方（服务器、本地机器、云端），而无需担心环境差异导致的问题。

### 2. 为什么选择 Docker？

使用 Docker 带来的好处是多方面的，这也是它迅速普及的核心原因：

- **环境一致性：** Docker 确保了开发、测试和生产环境的高度一致性，彻底解决了“在我电脑上明明是好的”这一经典难题。
- **快速交付和部署：** Docker 容器的启动是秒级的，相比传统的虚拟机启动要快得多。这极大地加快了开发、测试和部署的速度。
- **高效的资源利用：** Docker 容器直接运行在宿主机的内核上，没有独立的内核，因此对系统资源的占用非常少。一台主机上可以同时运行数千个 Docker 容器。
- **轻松迁移和扩展：** Docker 容器几乎可以在任何平台上运行，包括物理机、虚拟机、公有云、私有云等。这种出色的可移植性使得应用的迁移和扩展变得异常简单。
- **简化运维管理：** Docker 将应用及其环境打包在一起，简化了应用的安装、升级和维护过程。

### 3. Docker 能做什么？

Docker 的应用场景非常广泛，以下是一些典型的例子：

- **微服务架构：** 将大型单体应用拆分成多个独立的微服务，每个微服务运行在各自的 Docker 容器中，易于独立开发、部署和扩展。
- **持续集成/持续部署 (CI/CD)：** 在 CI/CD 流水线中，使用 Docker 可以快速构建和测试应用，并将其无缝部署到生产环境。
- **搭建隔离的开发环境：** 为不同的项目创建隔离的开发环境，避免不同项目依赖之间的冲突。
- **快速部署开源应用：** 许多开源应用都提供了官方的 Docker 镜像，用户只需一条命令即可快速部署，例如 WordPress、Redis、MySQL 等。
- **数据分析和科学计算：** 为数据科学家提供一个包含所有必要库和工具的可复现环境。

### 4. Docker 常见命令

以下是一些日常开发中非常常用的 Docker 命令：

| **命令**                                        | **描述**                     |
| ----------------------------------------------- | ---------------------------- |
| `docker run [OPTIONS] IMAGE [COMMAND] [ARG...]` | 创建并启动一个新的容器       |
| `docker ps [OPTIONS]`                           | 列出正在运行的容器           |
| `docker ps -a`                                  | 列出所有容器（包括已停止的） |
| `docker start [CONTAINER]`                      | 启动一个或多个已停止的容器   |
| `docker stop [CONTAINER]`                       | 停止一个或多个正在运行的容器 |
| `docker restart [CONTAINER]`                    | 重启一个或多个容器           |
| `docker rm [CONTAINER]`                         | 删除一个或多个容器           |
| `docker images [OPTIONS]`                       | 列出本地镜像                 |
| `docker rmi [IMAGE]`                            | 删除一个或多个镜像           |
| `docker pull [IMAGE]`                           | 从镜像仓库拉取镜像           |
| `docker push [IMAGE]`                           | 将本地镜像推送到镜像仓库     |
| `docker build -t [IMAGE_NAME]:[TAG] .`          | 根据 Dockerfile 构建镜像     |
| `docker exec -it [CONTAINER] [COMMAND]`         | 在正在运行的容器中执行命令   |
| `docker logs [OPTIONS] [CONTAINER]`             | 查看容器的日志               |
| `docker inspect [CONTAINER/IMAGE]`              | 查看容器或镜像的详细信息     |

### 5. `Dockerfile` 文件详解

`Dockerfile` 是一个用来构建镜像的文本文件，它包含了一条条的指令，每一条指令构建一层，因此 `Dockerfile` 的内容决定了镜像的最终构成。

一个基本的 `Dockerfile` 文件通常包含以下指令：

| **指令**                                            | **描述**                                                     |
| --------------------------------------------------- | ------------------------------------------------------------ |
| **`FROM <image>:<tag>`**                            | 指定基础镜像，必须是第一条指令。                             |
| **`MAINTAINER <name>`**                             | 镜像维护者的信息。                                           |
| **`RUN <command>`**                                 | 在镜像构建过程中执行命令。每条 `RUN` 指令都会在当前镜像层之上创建一个新的层。 |
| **`COPY <src> <dest>`**                             | 将宿主机的文件或目录复制到镜像的文件系统中。                 |
| **`ADD <src> <dest>`**                              | 功能与 `COPY` 类似，但 `ADD` 还支持解压 tar 文件和从 URL 下载文件。 |
| **`WORKDIR /path/to/workdir`**                      | 设置工作目录，之后的 `RUN`, `CMD`, `ENTRYPOINT`, `COPY`, `ADD` 指令都会在该目录下执行。 |
| **`EXPOSE <port>`**                                 | 声明容器运行时对外暴露的端口，但并不会实际发布端口，需要在使用 `docker run` 时通过 `-p` 或 `-P` 参数来指定。 |
| **`CMD ["executable","param1","param2"]`**          | 指定容器启动时默认执行的命令。如果 `docker run` 时指定了命令，则 `CMD` 的命令会被覆盖。 |
| **`ENTRYPOINT ["executable", "param1", "param2"]`** | 配置容器启动后执行的命令，并且不可被 `docker run` 提供的参数覆盖，而是将 `docker run` 的参数作为 `ENTRYPOINT` 的参数。 |
| **`ENV <key>=<value>`**                             | 设置环境变量。                                               |
| **`VOLUME ["/data"]`**                              | 创建一个可以从本地主机或其他容器挂载的挂载点，一般用来存放数据库和需要持久化的数据。 |

**示例 `Dockerfile` (构建一个简单的 Python 应用):**

Dockerfile

```
# 使用官方的 Python 3.9 镜像作为基础镜像
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 将当前目录下的所有文件复制到容器的 /app 目录下
COPY . .

# 安装 requirements.txt 中定义的依赖
RUN pip install --no-cache-dir -r requirements.txt

# 暴露端口 5000
EXPOSE 5000

# 容器启动时执行的命令
CMD ["python", "app.py"]
```

### 6. `docker-compose.yaml` 文件详解

`docker-compose` 是一个用于定义和运行多容器 Docker 应用程序的工具。通过一个 `YAML` 文件来配置应用的服务，然后使用一条命令，就可以创建并启动所有服务。

一个典型的 `docker-compose.yaml` 文件结构如下：

| **关键字**           | **描述**                                                     |
| -------------------- | ------------------------------------------------------------ |
| **`version`**        | 指定 `docker-compose.yaml` 文件的版本。                      |
| **`services`**       | 定义了应用中的各个服务。                                     |
| **`build`**          | 指定用于构建镜像的 `Dockerfile` 路径。                       |
| **`image`**          | 指定服务使用的镜像。如果同时指定了 `build`，则会使用 `build` 构建的镜像。 |
| **`container_name`** | 指定容器的名称。                                             |
| **`ports`**          | 映射端口，格式为 `"HOST:CONTAINER"`。                        |
| **`volumes`**        | 挂载卷，用于数据持久化。                                     |
| **`environment`**    | 设置环境变量。                                               |
| **`depends_on`**     | 定义服务之间的依赖关系。                                     |
| **`networks`**       | 将服务连接到指定的网络。                                     |

**示例 `docker-compose.yaml` (一个包含 Web 服务和 Redis 的应用):**

YAML

```
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:5000"
    volumes:
      - .:/app
    depends_on:
      - redis

  redis:
    image: "redis:alpine"
```

### 7. Docker 常见问题解答

#### Q1: Docker 如何运行最新的代码？比如我的代码发生更改。

**答：** 有两种主要方式来让容器运行最新的代码：

1. **重新构建镜像并重启容器：** 这是最标准和推荐的方式，尤其是在生产环境中。

   - 修改代码后，使用 `docker build -t my-app .` 重新构建镜像。
   - 停止并删除旧的容器：`docker stop my-app-container && docker rm my-app-container`。
   - 使用新镜像启动新容器：`docker run -d --name my-app-container -p 8080:80 my-app`。
   - 对于 `docker-compose`，过程更简单：`docker-compose up --build -d`。`--build` 选项会强制重新构建镜像。

2. **使用卷（Volume）挂载代码：** 这种方式非常适合开发环境，可以实现代码的热更新。

   - 在 `docker run` 命令中使用 `-v` 或 `--volume` 标志将本地的代码目录挂载到容器的相应目录。例如：`docker run -d -p 8080:80 -v /path/to/local/code:/app my-app`。

   - 在 

     ```
     docker-compose.yaml
     ```

      中，在 

     ```
     services
     ```

      下为服务添加 

     ```
     volumes
     ```

      配置：

     YAML

     ```
     volumes:
       - ./your_local_code_directory:/app
     ```

   - 这样，你在本地对代码的任何修改都会立即反映到容器内部，无需重新构建镜像。对于某些框架（如 Flask、Node.js with nodemon），你可能需要配置热重载功能来自动重启服务以应用更改。

#### Q2: Docker Compose 我的服务有依赖关系怎么办？

**答：** 在 `docker-compose.yaml` 文件中，可以使用 `depends_on` 关键字来定义服务之间的启动顺序。

例如，如果你的 `web` 服务依赖于 `db` 服务（数据库），你可以这样配置：

YAML

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "8000:5000"
    depends_on:
      - db
  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD: mysecretpassword
```

这样，`docker-compose` 会确保 `db` 服务在 `web` 服务之前启动。

**需要注意的是：** `depends_on` 只保证了服务的启动顺序，并不能保证依赖的服务（如数据库）已经完全准备好并可以接受连接。为了解决这个问题，通常需要在应用程序代码中加入重试连接的逻辑，或者使用一些等待脚本（如 `wait-for-it.sh`）来确保依赖服务真正可用后再启动应用。

#### Q3: 运行命令时，为什么有时候用服务名称有时候用容器名、怎么更好的区分呢？

**答：** 这是一个很好的问题，区分服务名称和容器名对于理解 Docker 网络至关重要。

- **服务名称 (Service Name):** 这是你在 `docker-compose.yaml` 文件中为每个服务定义的名称（例如上面例子中的 `web` 和 `db`）。**服务名称是 Docker Compose 内部网络中的 DNS 名称。** 这意味着，在同一个 `docker-compose` 项目中，一个容器可以通过服务名称直接访问另一个容器。例如，`web` 服务可以直接通过 `db` 这个主机名连接到数据库。
- **容器名 (Container Name):** 这是容器的实际名称。如果你在 `docker-compose.yaml` 中通过 `container_name` 指定了，那么容器就会使用这个名字。如果没有指定，Docker 会自动生成一个随机的名称（例如 `projectname_web_1`）。容器名在 Docker 主机上是唯一的。

**如何区分和使用：**

- **在 `docker-compose` 的网络内部：** 始终优先使用 **服务名称** 进行服务间的通信。这是 `docker-compose` 推荐的最佳实践，因为它解耦了服务发现，即使容器重启 IP 地址变化，服务名称依然有效，比如在另一个服务里连接`mysql`，host设置为服务名连接。
- **在 Docker 主机上操作单个容器：** 当你在主机上使用 `docker` 命令（如 `docker exec`, `docker stop`）来管理特定的容器时，你需要使用 **容器名** 或 **容器 ID**。

**总结：** 服务名称用于服务间的“对话”，容器名用于从“外部”（主机）对容器进行“操作”。

#### Q4: 我的敏感数据怎么办？比如 API KEY、密钥等？

**答：** 绝不能将敏感数据硬编码到 `Dockerfile` 或镜像中。有几种更安全的方式来处理敏感数据：

1. **环境变量文件 (`.env`):**

   - 在项目根目录下创建一个 

     ```
     .env
     ```

      文件，存放敏感数据，例如：

     ```
     API_KEY=your_super_secret_api_key
     DATABASE_PASSWORD=strongpassword
     ```

   - ```
     docker-compose
     ```

      会自动加载 

     ```
     .env
     ```

      文件中的变量，你可以在 

     ```
     docker-compose.yaml
     ```

      中直接使用它们：

     YAML

     ```yaml
     services:
       web:
         environment:
           - API_KEY=${API_KEY}
     ```

   - **重要：** 务必将 `.env` 文件添加到 `.gitignore` 中，避免将其提交到版本控制系统。

2. **Docker Secrets (推荐用于生产环境):**

   - 这是 Docker 提供的更安全的方式，尤其是在 Swarm 模式下。Secrets 会被加密传输和存储。
   - 你可以通过 `docker secret create` 命令创建 secret，然后在 `docker-compose.yaml` 中引用它。

3. **在 `docker run` 命令中通过 `-e` 或 `--env-file` 传递：**

   - `docker run -e "API_KEY=your_secret_key" my-app`
   - `docker run --env-file ./my.env my-app`

#### Q5: Docker 镜像构建时会构建进去哪些东西，比如我的 mysql 数据，使用卷的方式储存？

**答：** Docker 镜像在构建时（`docker build`）会包含 `Dockerfile` 中 `COPY` 或 `ADD` 指令所指定的所有文件和目录，以及 `RUN` 指令所安装的任何软件包和依赖。**它是一个静态的、只读的模板。**

**对于 MySQL 数据：**

- **绝对不会将数据构建到镜像中。** 镜像应该只包含应用程序代码和其运行环境，而不包含运行时产生的数据。

- **数据应该使用卷（Volume）来持久化。** 卷是独立于容器生命周期的。当你删除或更新容器时，卷中的数据会保留下来。

- 在 `docker-compose.yaml` 中为 MySQL 服务配置卷：

  YAML

  ```
  services:
    db:
      image: mysql:8.0
      volumes:
        - db_data:/var/lib/mysql
      environment:
        MYSQL_ROOT_PASSWORD: mysecretpassword
  
  volumes:
    db_data:
  ```

  在这个例子中：

  - `db_data:/var/lib/mysql` 将一个名为 `db_data` 的 Docker 命名卷挂载到容器的 `/var/lib/mysql` 目录，这是 MySQL 默认存储数据的地方。
  - 底部的 `volumes: db_data:` 定义了这个命名卷。

通过这种方式，你的 MySQL 数据将安全地存储在 Docker 管理的卷中，与容器的生命周期完全分离，实现了数据的持久化。