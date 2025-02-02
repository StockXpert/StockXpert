const express=require('express');
const router=express.Router();
const SortieController=require('../Controller/SortieController')
const authMiddleware=require('../Middlewares/authMiddleware');
const multer=require('../Middlewares/multer');
router.put('/uploadBonDecharge',authMiddleware('upload bon decharge'),multer,(req,res)=>res.status(200))
router.put('/uploadSortie',authMiddleware('upload sortie'),multer,(req,res)=>res.status(200))
router.post('/demandeFourniture',authMiddleware("demande fourniture"),SortieController.demandeFourniture);
router.post('/fournitureRespApp',authMiddleware('approuve fourniture by responsable'),SortieController.fournitureRespApp)
router.post('/fournitureDirApp',authMiddleware('approuve fourniture by director'),SortieController.fournitureDirApp);
router.post('/fournitureMagApp',authMiddleware('approuve fourniture by magasinier'),SortieController.fournitureMagApp);
router.post('/livrer',authMiddleware('livrer'),SortieController.livrer)
router.put('/updateDirApp',authMiddleware('update approuve by director'),SortieController.updateRespDirApp);
router.put('/updateRespApp',authMiddleware('update approuve by responsable'),SortieController.updateRespDirApp);
router.put('/updateMagApp',authMiddleware('update approuve by magasinier'),SortieController.updateMagApp);
router.put('/updateConsDemande',authMiddleware('update demande by consommateur'),SortieController.updateConsDemande);
router.delete('/deleteFourniture',authMiddleware("delete fourniture"),SortieController.deleteFourniture);
router.get('/showAllDemandes',authMiddleware('show all demandes'),SortieController.showAllDemandes)
router.post('/showNewDemandes',authMiddleware('show new demandes'),SortieController.showNewDemandes);
router.put('/readNotif',authMiddleware('read notif'),SortieController.readNotif);
router.put('/readAllNotif',authMiddleware('read all notif'),SortieController.readAllNotif);
router.post('/showDemande',authMiddleware('show demande'),SortieController.showDemande)
module.exports=router;