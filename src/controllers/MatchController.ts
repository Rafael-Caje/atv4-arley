import AppDataSource from "../data-source";
import { Request, Response } from "express";
import { Team } from "../entities/Team";
import { Match} from "../entities/Match";

class MatchController{
    public async create (req: Request, res: Response): Promise<Response>{
        const {idhost, idvisitor, date} = req.body
        const host = await AppDataSource
        .getRepository(Team)
        .findOneBy({id:idhost})

        const visitor = await AppDataSource
        .getRepository(Team)
        .findOneBy({id:idvisitor})

        const match = new Match()
        match.host = host
        match.visitor = visitor
        match.date = date 

        const newMatch = await AppDataSource
        .getRepository(Match)
        .save(match)
        return res.json(newMatch)
    }
    public async listLimit(req: Request, res: Response): Promise<Response>{
        const {limit, offset} = req.body
        const Matches = await AppDataSource
        .getRepository(Match)
        .find({
            relations:{host:true, visitor:true},
            order:{date:"DESC"},
            take:limit,
            skip:offset
        })
        return res.json(Matches)
    }
    public async listbyId(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
    
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
    
            const team = await AppDataSource
                .getRepository(Team)
                .findOneBy({
                    id: id
                });
    
            if (!team) {
                return res.status(404).json({ error: 'Time não encontrado' });
            }
    
            const Matches = await AppDataSource
                .getRepository(Match)
                .find({
                    where: [{ host: team }, { visitor: team }],
                    relations: { host: true, visitor: true },
                    order: { date: "DESC" },
                });
    
            return res.json(Matches);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar time pelo ID' });
        }
    }
    
    public async update (req: Request, res: Response): Promise<Response>{
        const {id, idhost, idvisitor, date} = req.body

        const host = await AppDataSource
        .getRepository(Team)
        .findOneBy({id:idhost})
        console.log(host)
        if(!host){
            return res.json({error: "Mandante  desconhecido"})
        }

        const visitor = await AppDataSource
        .getRepository(Team)
        .findOneBy({id:idvisitor})
        if(!visitor){
            return res.json({error:"Visitante desconhecido"})
        }

        var match = await AppDataSource
        .getRepository(Match)
        .findOneBy({id:id})

        match.host = host
        match.visitor = visitor
        match.date = date

        const updatedMatch = await AppDataSource
        .getRepository(Match)
        .save({id:id})
        return res.json(updatedMatch)
    }
    public async delete(req: Request, res: Response): Promise<Response>{
        const {id} = req.body;
        const match = await AppDataSource
        .getRepository(Match)
        .delete({id:id})
        return res.json({match})
    }
}
export default new MatchController();
