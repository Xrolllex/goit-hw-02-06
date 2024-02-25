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
  const body = req.body;
  const validate = validateJoi(body);
  
  if (validate.error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Validation failed", 
      details: validate.error.details 
    });
  }

  try {
    const contact = new Contacts(validate.value);
    await contact.save();
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
  console.log(error)
    res.status(400).json({
      status: "error",
      code: 400,
      message: "Bad Request",
    });
  }
})

router.put('/:contactId', async (req, res) => {
  const { contactId } = req.params;
  const body = req.body;
  const validate = validateJoi(body); 

    if (validate.error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Validation failed",
      details: validate.error.details
    });
  }

  try {
    const updatedContact = await Contacts.findByIdAndUpdate(
      contactId, 
      validate.value, 
      { new: true } 
    );

    if (!updatedContact) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Contact not found"
      });
    }

  
    res.json({
      status: "success",
      code: 200,
      data: updatedContact,
      message: "Contact updated successfully"
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "Bad request",
      error: error.message
    });
  }
});




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
