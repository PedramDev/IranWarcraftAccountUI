export class Slugator {

    generate(slug ?: string){
        if(slug == null || undefined){
            return "اسلاگ نمیتواد خالی باشد";
        }
        else{
            slug = slug.replaceAll(' ','-').toLowerCase();
            return slug;
        }
    }
}

