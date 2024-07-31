interface AppConfig {
    name: string,
    github: {
        title: string,
        url: string
    },
    author: {
        name: string,
        url: string
    },
}

export const appConfig: AppConfig = {
    name: "Where is all the sDAI?",
    github: {
        title: "Where is all the sDAI?",
        url: "https://github.com/fmorisan/where-is-the-sdai",
    },
    author: {
        name: "fmorisan",
        url: "https://github.com/fmorisan/",
    }
}