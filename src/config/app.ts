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
        title: "React Shadcn Starter",
        url: "https://github.com/hayyi2/react-shadcn-starter",
    },
    author: {
        name: "fmorisan",
        url: "https://github.com/fmorisan/",
    }
}