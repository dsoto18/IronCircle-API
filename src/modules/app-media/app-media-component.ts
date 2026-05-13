export class AppMediaComponent {
    constructor(
        // private userDatastore: UserDatastore,
        // private postDatastore: PostsDatastore
    ){}

    public static build(): AppMediaComponent {
        // const userDatastore = UserDatastore.build();
        // const postDatastore = PostsDatastore.build();
        return new AppMediaComponent();
    }

}