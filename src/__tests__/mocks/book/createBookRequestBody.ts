const MissingTitle = {
  body: {
    authorId: 1,
    description: "Description of my book, lorem ipsum dolor sit",
    price: 23,
    quantity: 23,
    author: {
      name: "James Jordan",
    },
  },
  scenario: "Missing Title",
};

const MissingDescription = {
  body: {
    authorId: 1,
    title: "title of my book",
    price: 23,
    quantity: 23,
    author: {
      name: "James Jordan",
    },
  },
  scenario: "Missing Description",
};

const MissingPrice = {
  body: {
    authorId: 1,
    title: "title of my book",
    description: "Description of my book, lorem ipsum dolor sit",
    quantity: 23,
    author: {
      name: "James Jordan",
    },
  },
  scenario: "Missing Price",
};

const MissingQuantity = {
  body: {
    authorId: 1,
    title: "title of my book",
    description: "Description of my book, lorem ipsum dolor sit",
    price: 23,
    author: {
      name: "James Jordan",
    },
  },
  scenario: "Missing Quantity",
};

export const MissingAuthorAndAuthorId = {
  body: {
    title: "title of my book",
    description: "Description of my book, lorem ipsum dolor sit",
    price: 23,
    quantity: 23,
  },
  scenario: "Missing both, Author And AuthorId",
};

const AuthorIdNotInt = {
  body: {
    authorId: "notInt",
    title: "title of my book",
    description: "Description of my book, lorem ipsum dolor sit",
    price: 23,
    quantity: 23,
    author: {
      name: "James Jordan",
    },
  },
  scenario: "AuthorId Not Integer",
};

const TitleNotString = {
  body: {
    authorId: 1,
    title: 25,
    description: "Description of my book, lorem ipsum dolor sit",
    price: 23,
    quantity: 23,
    author: {
      name: "James Jordan",
    },
  },
  scenario: "Title Not String",
};

const DescriptionNotString = {
  body: {
    authorId: 1,
    title: "title of my book",
    description: 23,
    price: 23,
    quantity: 23,
    author: {
      name: "James Jordan",
    },
  },
  scenario: "Description Not String",
};

const PriceNotInt = {
  body: {
    authorId: 1,
    title: "title of my book",
    description: "Description of my book, lorem ipsum dolor sit",
    price: "notInt",
    quantity: 23,
    author: {
      name: "James Jordan",
    },
  },
  scenario: "Price Not Integer",
};

const QuantityNotInt = {
  body: {
    authorId: 1,
    title: "title of my book",
    description: "Description of my book, lorem ipsum dolor sit",
    price: 23,
    quantity: "notInt",
    author: {
      name: "James Jordan",
    },
  },
  scenario: "Quantity Not Integer",
};

const AuthorHasNoName = {
  body: {
    authorId: 1,
    title: "title of my book",
    description: "Description of my book, lorem ipsum dolor sit",
    price: 23,
    quantity: 23,
    author: {},
  },
  scenario: "Author has no name",
};

export const InvalidUpsertBookRequestBodies = [
  MissingTitle,
  MissingDescription,
  MissingPrice,
  MissingQuantity,
  MissingAuthorAndAuthorId,
  AuthorIdNotInt,
  TitleNotString,
  DescriptionNotString,
  PriceNotInt,
  QuantityNotInt,
  AuthorHasNoName,
];

const OnlyAuthorIsSet = {
  body: {
    title: "title of my book",
    description: "Description of my book, lorem ipsum dolor sit",
    price: 23,
    quantity: 23,
    author: {
      name: "James Jordan",
    },
  },
  scenario: "Only Author Is Set",
};

const OnlyAuthorIdIsSet = {
  body: {
    authorId: 1,
    title: "title of my book",
    description: "Description of my book, lorem ipsum dolor sit",
    price: 23,
    quantity: 23,
  },
  scenario: "Only AuthorId Is Set",
};

export const ValidCreateBookRequestBody = {
  body: {
    authorId: 1,
    title: "title of my book",
    description: "Description of my book, lorem ipsum dolor sit",
    price: 23,
    quantity: 23,
    author: {
      name: "James Jordan",
    },
  },
  scenario: "All Properties Are Set",
};

export const ValidCreateBookRequestBodies = [
  OnlyAuthorIsSet,
  OnlyAuthorIdIsSet,
  ValidCreateBookRequestBody,
];
