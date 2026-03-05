const { Router } = require("express");
const OrderController = require("./order.controller");
const FreteController = require("./frete.controller");
const { rotaProtegida } = require("../../shared/middlewares/token.middleware");


const router = Router();

router.post("/fretes", FreteController.calcular);

// router.post("/fretes", async (req, res) => {

//   const melhorEnvio = await fetch("https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NTYiLCJqdGkiOiIyZDRlYjZjZjQzZmJhMGVhN2RmNzQ3NGRhY2NmYWVjZmYwNGY3OGJkZDdjNGZlN2RkYjU5NGQ2ZjYwMWRiNDgzY2JhOTg3Y2Q2Y2M1ZWY2NiIsImlhdCI6MTc3MjU0MDI2Ni41MzEzMDksIm5iZiI6MTc3MjU0MDI2Ni41MzEzMTIsImV4cCI6MTgwNDA3NjI2Ni41MjA5MzIsInN1YiI6ImExMzYyOGFiLTQ4ZmItNDYyNy1hM2Y5LWVjOTY4NDBiZTY0YSIsInNjb3BlcyI6WyJlY29tbWVyY2Utc2hpcHBpbmciLCJzaGlwcGluZy1wcmV2aWV3Iiwic2hpcHBpbmctZ2VuZXJhdGUiLCJzaGlwcGluZy1wcmludCIsInNoaXBwaW5nLWNvbXBhbmllcyIsInNoaXBwaW5nLWNoZWNrb3V0Iiwic2hpcHBpbmctc2hhcmUiLCJzaGlwcGluZy10cmFja2luZyIsInNoaXBwaW5nLWNhbGN1bGF0ZSIsInNoaXBwaW5nLWNhbmNlbCJdfQ.F4BGZ0w5goNS5xw3eXqTnNGsTRcgiOqWgofkrFLC48cNz5G4RMWKTWmhmOo1RHXdXyuAgJGfmoeehMozF-EaRAd1qOiTU0BsCwlxhajOH3wk9KiNv65fCWODhJyj9wta_BL9T59XMmgCWcJvvnzAU-N1jh-Rb-VmhmKWpZbT6CaXGL0ysu1EvFKDsT6BKlcxzn4GY-xmlZjQzSKXQL6GACh3perUfL-fS1RfE6I83kyVz_KBpoUOPiAG_6yhuee1ABxh06Um-zj4tQ9ZoeAwPOxyJ9kfA_hubFTm3myk61t_We9DEfXjRpkSs96OeqUnnWiTxdAMLYgzVFETyJTAJAaF9ttW5nPeoGBxFkvyTWYMJWv2NFZFPTyg1SWRE7ALUwX1FtPGbEj5YzszL2rKQjKpr2rBfr8UDwFfyeqe4P7bXgsEWb7ZYUfyGlNBVzzhVnOS5xLf3r7luVBC6msPmm4NSlUxCZdHbZlZVbF31jiRV-GkCmx6hUQjpvcYjhfld3xT_0ZLxDAo80GpliI56KbOloiHeRCDYmbTSd6Qy0MC8ULiSPKIe-ShHxwHP2tP_GJJFBj5EtsllWNgV1zrx0YDOQVRG8MDgvkPowMEPlo0EDcLMO7lvT3A-dcscJEh7WhVcStwPiZ5eiF7NWvumVRCBJdtrl_0QYDxIY38MPw"
//     },
//     body: JSON.stringify(req.body)
//   })

//   const fretes = await melhorEnvio.json();

//   return res.status(200).json(fretes);
// });


router.use(rotaProtegida);
router.post("/", OrderController.create);
router.get("/", OrderController.findAll);
router.get("/:id", OrderController.findById);
router.put("/:id/status", OrderController.updateStatus);
router.delete("/:id", OrderController.delete);

module.exports = router;