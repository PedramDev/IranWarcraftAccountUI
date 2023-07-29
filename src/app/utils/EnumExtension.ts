export class EnumExtension{
    public static toEnum(str : string ,e : any){
        let splited = str.split('');
        splited[0] = splited[0].toUpperCase();
        const enumStr = splited.join('');
        const shit = e[enumStr as keyof typeof e];

        console.log(shit);

        return shit;
    }
}