import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();



export const createLog = async (request, response) => {
    try {
        const {roundId,userId,score,mistake,date} =request.body;
        const user = await prisma.user.findUnique({
            where:{id :parseInt(userId)},
        });
        const round = await prisma.round.findUnique({
            where:{id :parseInt( roundId)},
        });
      if(!user){
        response.code(404).send({ error: "User not found" });
}
   if(!round){
    response.code(404).send({ error: "Round not found" });
}
if(round && user){
    const log = await prisma.log.create({
        data: {
            score   : parseInt(score),
            mistake : parseInt(mistake),
            date    : new Date(),
            roundId : parseInt(roundId),
            userId  : parseInt(userId)
        },
        
      });
      response.code(201).send({ state: "success",log});
}
    } catch (error) {
      console.error("Registration error :", error);
      response.code(500).send({ state: "false", error: "Internal server error" });
    }
   
  }