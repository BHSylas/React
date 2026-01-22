export default function getName(rawName : string | undefined, replacable: string | null = null){
    //more logic if required
    if(rawName === null || rawName === undefined) {
        return replacable;
    }
    const spliter = rawName.split('@')[0];
    if((spliter === rawName && spliter.length > 12) && replacable !== null) return replacable;
    return spliter;
}