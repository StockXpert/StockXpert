const SortieService=require('../Services/SortieService')
const SortieModel=require('../Models/SortieModel')
function demandeFourniture(req,res){
const {produits,dateDemande}=req.body;
const {email}=req
SortieModel.addFourniture(email,dateDemande).then((numDemande)=>{
    SortieModel.insertFournir(numDemande,produits).then(()=>{
        res.status(200).json({response:'demande added'})
    }).catch(()=>{res.status(500).json({response:'internal error'})})
}).catch(()=>{res.status(500).json({response:'internal error'})})
}
function fournitureRespApp(req,res){
    const {produits,numDemande}=req.body
    SortieModel.updateAccordedQuantite(numDemande,produits).then(()=>{
        SortieModel.changeDemandeStatNotif(numDemande,'visee par resp','other_notif').then(()=>{
            res.status(200).json({response:'resp approuved'})
        }).catch(()=>{res.status(500).json({response:'internal error'})})
    }).catch(()=>{res.status(500).json({response:'internal error'})})
}
function fournitureDirApp(req,res){
    const {produits,numDemande}=req.body;
    SortieModel.updateAccordedQuantite(numDemande,produits).then(()=>{
        SortieModel.changeDemandeStatNotif(numDemande,'visee par dg','other_notif').then(()=>{
            res.status(200).json({response:'Dir approuved'})
        }).catch(()=>{res.status(500).json({response:'internal error'})})
    }).catch(()=>{res.status(500).json({response:'internal error'})})
}
function fournitureMagApp(req,res){
    const {produits,numDemande}=req.body;
    SortieModel.updateLivredQuantite(numDemande,produits).then(()=>{
        SortieModel.changeDemandeStatNotif(numDemande,'pret','other_notif').then(()=>{
            res.status(200).json({response:'Mag approuved'})
        }).catch(()=>{res.status(500).json({response:'internal error'})})
    }).catch(()=>{res.status(500).json({response:'internal error'})})
}
function livrer(req,res)
{
    const {numDemande,dateSortie}=req.body;
    SortieModel.getDemandeProducts(numDemande).then((produits)=>{
        SortieModel.changeDemandeStatNotif(numDemande,'servie','cons_notif').then(()=>{
            SortieModel.insertDateSortie(numDemande,dateSortie).then(()=>{
                SortieService.genererBonSortie(numDemande,dateSortie,produits,'1B_H87qYOz-GsKPPVftyeTcXFX68n5bQiOMaBHR202GA').then((link)=>{
                    res.status(200).json({response:link})
                }).catch(()=>{res.status(500).json({response:'internal error'})})
            }).catch(()=>{res.status(500).json({response:'internal error'})})
        }).catch(()=>{res.status(500).json({response:'internal error'})})
    }).catch(()=>{res.status(500).json({response:'internal error'})})
}
function deleteFourniture(req,res)
{
    const {numDemande}=req.body;
    SortieModel.canDeleteFourniture(numDemande).then(()=>{
        SortieModel.deleteFourniture(numDemande).then(()=>{
            res.status(200).json({response:"deleted"})
        }).catch(()=>res.status(500).json({response:"internal error"}))
    }).catch(()=>res.status(400).json({response:"prohibited to delete"}))
}
function showAllDemandes(req,res)
{
    const {role,email}=req;
    let statement;
    switch (role) {
        case 'magasinier':
            statement="etat in ('visee par dir','pret','livree')"
            break;
        case 'directeur':
            statement="etat in ('visee par resp','visee par dir','pret','livree')" 
        default:
            statement=''
            break;
    }
    SortieModel.getAllDemandes(statement,email).then((demandes)=>{
        res.status(200).json({response:demandes})
    }).catch(()=>res.status(500).json({response:"internal error"}))
}
function showNewDemandes(req,res)
{
    const {role,email}=req;
    let etat;
    switch (role) {
        case 'consommateur':
            etat='pret'
        case 'magasinier':
            etat='visee par dir'
            break;
        case 'directeur':
            etat='visee par resp' 
        default:
            etat='en attente'
            break;
    }
    SortieModel.getNewDemandes(etat,email,role==='consommateur'?'cons_notif':'other_notif').then((demandes)=>{
        res.status(200).json({response:demandes})
    }).catch(()=>res.status(500).json({response:"internal error"}))
}
function updateConsDemande(req,res)
{
    const {numDemande,addedProducts,deletedProducts}=req.body
    SortieModel.canDeleteFourniture(numDemande).then(()=>{
        SortieModel.insertFournir(numDemande,addedProducts).then(()=>{
            SortieModel.deleteProductsFournir(numDemande,deletedProducts).then(()=>{
                res.status(200).json({response:"updated"})
            }).catch(()=>res.status(500).json({response:"internal error"}))
        }).catch(()=>res.status(500).json({response:"internal error"}))
    }).catch(()=>res.status(400).json({response:"prohibited"}))
}
function updateMagApp(req,res)
{
    const {role}=req;
    const {numDemande,produits}=req.body;
    SortieService.canUpdate(numDemande,role).then(()=>{
        SortieModel.updateLivredQuantite(numDemande,produits).then(()=>{
            res.status(200).json({response:"updated"})
        }).catch(()=>res.status(500).json({response:"internal error"}))
    }).catch(()=>res.status(400).json({response:"prohibited"})) 
}
function updateRespDirApp(req,res)
{
    const {role}=req;
    const {numDemande,produits}=req.body;
    SortieService.canUpdate(numDemande,role).then(()=>{
        SortieModel.updateAccordedQuantite(numDemande,produits).then(()=>{
            res.status(200).json({response:"updated"})
        }).catch(()=>res.status(500).json({response:"internal error"}))
    }).catch(()=>res.status(400).json({response:"prohibited"})) 
}
function readNotif(req,res)
{
    const {role}=req;
    const {numDemande}=req.body;
    SortieModel.readNotif(numDemande,role==='consommateur'?'cons_notif':'other_notif').then(()=>{
        res.status(200).json({response:"read"})
    }).catch(()=>res.status(500).json({response:"internal error"}))
}
module.exports={demandeFourniture,fournitureDirApp,fournitureRespApp,fournitureMagApp,livrer,
deleteFourniture,showNewDemandes,showAllDemandes,updateConsDemande,updateRespDirApp,updateMagApp,readNotif}