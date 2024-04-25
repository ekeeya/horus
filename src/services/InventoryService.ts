import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';

enablePromise(true);

class InventoryService {
  public static db: SQLiteDatabase;

  private static getDBConnection(): Promise<SQLiteDatabase> {
    return openDatabase({name: 'inventory.db', location: 'default'});
  }

  public static async init() {
    console.log('initializing db');
    InventoryService.db = await InventoryService.getDBConnection();
    await InventoryService.createTables();
  }

  public static async createTables() {
    const tableQueries = [
      'CREATE TABLE IF NOT EXISTS school (id INTEGER PRIMARY KEY, name TEXT NOT NULL);',
      'CREATE TABLE IF NOT EXISTS pos_center (id INTEGER PRIMARY KEY, name TEXT NOT NULL, schoolName TEXT NOT NULL, schoolId INTEGER NOT NULL, FOREIGN KEY (schoolId) REFERENCES school(id));',
      'CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY, name TEXT NOT NULL, icon TEXT NOT NULL, provider TEXT NOT NULL, image TEXT NOT NULL);',
      'CREATE TABLE IF NOT EXISTS inventory_item (id INTEGER PRIMARY KEY, name TEXT NOT NULL, categoryId INTEGER NOT NULL, price REAL NOT NULL, posId INTEGER NOT NULL, quantity INTEGER DEFAULT 0, FOREIGN KEY (categoryId) REFERENCES category(id), FOREIGN KEY (posId) REFERENCES pos_center(id));',
      "CREATE TABLE IF NOT EXISTS wallet (id INTEGER PRIMARY KEY, cardNo TEXT NOT NULL, balance REAL NOT NULL, maximumDailyLimit REAL NOT NULL, enableDailyLimit INTEGER NOT NULL CHECK (enableDailyLimit IN (0, 1)), status TEXT NOT NULL CHECK (status IN ('PENDING', 'SUSPENDED', 'ACTIVE', 'DISABLED')));",
      'CREATE TABLE IF NOT EXISTS student (id INTEGER PRIMARY KEY, firstName TEXT NOT NULL, lastName TEXT NOT NULL, middleName TEXT NOT NULL, fullName TEXT NOT NULL, walletId INTEGER NOT NULL, schoolId INTEGER NOT NULL, classId INTEGER NOT NULL, className TEXT NOT NULL, FOREIGN KEY (walletId) REFERENCES wallet(id), FOREIGN KEY (schoolId) REFERENCES school(id));',
      "CREATE TABLE IF NOT EXISTS order_table (id INTEGER PRIMARY KEY, walletId INTEGER NOT NULL, amount REAL NOT NULL, date TEXT NOT NULL, status TEXT NOT NULL CHECK (status IN ('Pending', 'Processed', 'Cancelled')), posId INTEGER NOT NULL, FOREIGN KEY (walletId) REFERENCES wallet(id), FOREIGN KEY (posId) REFERENCES pos_center(id));",
      'CREATE TABLE IF NOT EXISTS order_item (id INTEGER PRIMARY KEY, name TEXT NOT NULL, categoryId INTEGER NOT NULL, price REAL NOT NULL, orderId INTEGER NOT NULL, quantity INTEGER NOT NULL, FOREIGN KEY (categoryId) REFERENCES category(id), FOREIGN KEY (orderId) REFERENCES order_table(id));',
    ];

    tableQueries.map(async query => {
      await InventoryService.db.executeSql(query);
    });
  }

  public static async save(tableName: string, items: Array<any>): Promise<any> {
    if (items.length < 1) {
      return Promise.reject('Items list cannot be empty');
    }

    const firstItem = items[0];
    const fields = Object.keys(firstItem);
    const insertQuery =
      `INSERT
      OR REPLACE INTO
      ${tableName}
      (
      ${fields.join(', ')}
      )
      VALUES ` +
      items
        .map(
          i =>
            `(${fields
              .map(field =>
                typeof i[field] === 'string' ? "'" + i[field] + "'" : i[field],
              )
              .join(', ')})`,
        )
        .join(',');

    return InventoryService.db.executeSql(insertQuery);
  }

  public static async update(
    tableName: string,
    updateData: object,
  ): Promise<any> {
    try {
      const fields: string[] = Object.keys(updateData);
      const updateStatements = fields.map(field => {
        // @ts-ignore
        if (typeof updateData[field] === 'string') {
          // @ts-ignore
          return `${field}='${updateData[field]}'`;
        } else {
          // @ts-ignore
          return `${field}=${updateData[field]}`;
        }
      });
      const query = `UPDATE ${tableName} SET ${updateStatements.join(', ')}`;
      console.log(query);
      return InventoryService.db.executeSql(query);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public static async fetch(
    tableName: String,
    fields: string | '*' = '*',
    limit: number | 10 = 10,
    orderBy: string | 'id' = 'id',
  ): Promise<any> {
    try {
      const items: any[] = [];
      const results = await InventoryService.db.executeSql(
        `SELECT rowid as id,  ${
          fields === '*' ? tableName + '.' + fields : fields
        } FROM ${tableName} ORDER BY ${orderBy} limit ${limit}`,
      );
      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          items.push(result.rows.item(index));
        }
      });
      return items;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static async deleteItem(id: number, tableName: string): Promise<any> {
    try {
      const deleteQuery = `DELETE from ${tableName} where id = ${id}`;
      await InventoryService.db.executeSql(deleteQuery);
      return Promise.resolve(false);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

export default InventoryService;
