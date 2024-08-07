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
    name: "Where is all the sDAI? - Viridian Advisor",
    github: {
        title: "Where is all the sDAI?",
        url: "https://github.com/fmorisan/where-is-the-sdai",
    },
    author: {
        name: "Viridian Advisor & fmorisan, with thanks to hayyi2",
        url: "https://github.com/fmorisan/",
    }
}
