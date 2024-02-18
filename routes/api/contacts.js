const express = require('express')
const router = express.Router()
const {Contacts} = require ("../schema")
const { validateJoi } = require('./validation')


router.get('/', async (req, res) => {
   try{
    const contacts = await Contacts.find()
      res.json ({
      status: "success",
      code: 200,
      data: contacts
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "Bad request"
    })
  }
})

router.get('/:contactId', async (req, res) => {
  const {contactId} = req.params;
  try {
    const contact = await Contacts.findById(contactId)
    res.json ({
      status: "success",
      code: 200,
      data: contact,
      message: "Your contact has been found"
    })
  }   catch (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "Bad request"
    })
  }
  
})

router.post('/', async (req, res) => {
  const validate = validateJoi(contact)  
  const body = req.body
    const contact = new Contacts(body)
    
  try {
    await validate.value.save();
    res.json({
      status: "success",
      code: 201,
      data: contact,
      message: "You just added a new contact",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "Bad Request",
    });
  }
})

router.delete('/:contactId', async (req, res) => {
  const { contactId } = req.params;
  
  try {
   const deleteContact = await Contacts.deleteOne({_id: contactId})
    res.json({
      status: "success",
      code: 200,
      data: contact,
      message: "You deleted contact from your list",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "Bad Request",
    });
  }
})

router.put('/:contactId', async (req, res) => {
  const validate = validateJoi(contact);
    const { contactId } = req.params;
    const body = req.body;
       
    try {
      const contact = await Contacts.findByIdAndUpdate({_id:contactId}, body);
      await validate.value.save();
    res.json({
      status: "success",
      code: 200,
      data: contact,
      message: "You updated contact",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "Bad Request",
    });
  }
})


router.patch('/:contactId/favorite', async(req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  if (favorite === undefined) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  try {
    const updatedContact = await Contacts.findByIdAndUpdate(contactId, { favorite: favorite }, { new: true });
    
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router
