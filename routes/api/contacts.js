const express = require('express')
const router = express.Router()
const {Contacts} = require ("../schema")
const { validatePerson } = require('../validation')
const {middleware} = require ('../../controllers/middleware')


router.use(middleware);

router.get('/', async (req, res) => {
   try{
    const userId = req.user.id;
    const contacts = await Contacts.find({owner: userId})
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
  const userId = req.user.id;
  try {
        const contact = await Contacts.findOne({ _id: contactId, owner: userId })
        if (!contact) {
          return res.status(404).json({
            status: "error",
            message: "Contact not found or you do not have permission"
          })
        }
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
  const userId = req.user.id;
  const validate = validatePerson(body);
  
  if (validate.error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Validation failed", 
      details: validate.error.details 
    });
  }

  try {
    const contact = new Contacts({...validate.value, owner: userId});
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
  const userId = req.user.id;
  
  try {
   const deleteContact = await Contacts.deleteOne({ _id: contactId, owner: userId })
    res.json({
      status: "success",
      code: 200,
      data: deleteContact,
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
  const userId = req.user.id;
  const validate = validatePerson(body); 

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
      { _id: contactId, owner: userId }, 
      { $set: validate.value }, 
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
