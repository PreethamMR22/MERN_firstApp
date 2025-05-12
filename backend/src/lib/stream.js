import {StreamChat} from "stream-chat"
import "dotenv/config"

const apiKey= process.env.CALLORA_API_KEY
const apiSecrete= process.env.CALLORA_API_SECRETE

if(!apiKey || !apiSecrete) {
    console.log("Either Stream API key or API secrete is missing");
}

//create the user in Stream
const streamClient= StreamChat.getInstance(apiKey,apiSecrete);
export const upsertStreamUser= async (userData)=> {
    try {
     await streamClient.upsertUsers([userData]);   
    return userData;
    } catch (err) {
        console.log("Error Upserting Stream user",err);
    }
}


//TODO: We'll do it later
export const generateStreamToken= async(userId)=> {

}