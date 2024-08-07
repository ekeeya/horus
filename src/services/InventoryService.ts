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
    InventoryService.db = await InventoryService.getDBConnection();
    await InventoryService.createTables();
  }

  public static async createTables() {
    const tableQueries = [
      'CREATE TABLE IF NOT EXISTS school (id INTEGER PRIMARY KEY, name TEXT NOT NULL);',
      'CREATE TABLE IF NOT EXISTS pos_center (id INTEGER PRIMARY KEY, name TEXT NOT NULL, schoolName TEXT NOT NULL, schoolId INTEGER NOT NULL, FOREIGN KEY (schoolId) REFERENCES school(id));',
      'CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY, name TEXT NOT NULL, icon TEXT NOT NULL, provider TEXT NOT NULL, image TEXT NOT NULL, frequency INTEGER DEFAULT 0);',
      'CREATE TABLE IF NOT EXISTS inventory_item (id INTEGER PRIMARY KEY, name TEXT NOT NULL, categoryId INTEGER NOT NULL, price REAL NOT NULL, posId INTEGER NOT NULL, quantity INTEGER DEFAULT 0, frequency INTEGER DEFAULT 0, FOREIGN KEY (categoryId) REFERENCES category(id));',
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

  public static count(tableName: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      InventoryService.db.transaction(tx => {
        tx.executeSql(
          `SELECT COUNT(*) as count FROM ${tableName}`,
          [],
          (_, {rows}) => {
            const count = rows.item(0).count;
            resolve(count);
          },
          (_, error) => {
            reject(error);
          },
        );
      });
    });
  }

  public static async update(
    tableName: string,
    id: number,
    updateData: {
      [key: string]: number | string,
    },
  ): Promise<any> {
    try {
      const fields: string[] = Object.keys(updateData);
      const updateStatements = fields.map(field => {
        if (typeof updateData[field] === 'string') {
          return `${field}='${updateData[field]}'`;
        } else {
          return `${field}=${updateData[field]}`;
        }
      });
      const query = `UPDATE ${tableName} SET ${updateStatements.join(
        ', ',
      )} WHERE id=${id}`;

      return new Promise((resolve, reject) => {
        InventoryService.db.transaction(tx => {
          tx.executeSql(
            query,
            [],
            (_, result) => {
              if (result.rowsAffected > 0) {
                tx.executeSql(
                  `SELECT * FROM ${tableName} WHERE id = last_insert_rowid()`,
                  [],
                  (_, {rows}) => {
                    resolve(rows.item(0));
                  },
                  (_, error) => {
                    reject(error);
                  },
                );
              } else {
                reject(new Error('No rows affected'));
              }
            },
            (_, error) => {
              reject(error);
            },
          );
        });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static async fetch(
    tableName: String,
    lookups: {
      [key: string]: number | string;
    } | null = null,
    limit: number | 10 = 10,
    orderBy: string | 'id' = 'id',
  ): Promise<any> {
    try {
      const items: any[] = [];
      const query = lookups
        ? `SELECT * FROM ${tableName} WHERE (${Object.keys(lookups)
            .map(
              key =>
                `${key}=${
                  typeof lookups[key] === 'string'
                    ? "'" + lookups[key] + "'"
                    : lookups[key]
                }`,
            )
            .join(' AND ')}) ORDER BY ${orderBy} DESC LIMIT ${limit}`
        : `SELECT * FROM ${tableName} ORDER BY ${orderBy} DESC LIMIT ${limit}`;
      const results = await InventoryService.db.executeSql(query);
      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          items.push(result.rows.item(index));
        }
      });
      return items;
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }

  public static async getById(
    tableName: String,
    id: number | undefined,
  ): Promise<any> {
    try {
      let item: any = null;
      const query = `SELECT * FROM ${tableName} WHERE id= ?`;
      const results = await InventoryService.db.executeSql(query, [id]);
      results.forEach(result => {
        if (result.rows.length > 0) {
          item = result.rows.item(0);
        }
      });
      return item;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public static async search(
    tableName: string,
    searchTerm: string,
    orderBy: string | 'id' = 'id',
  ): Promise<any> {
    try {
      const items: any[] = [];
      const results = await InventoryService.db.executeSql(
        `SELECT *  FROM ${tableName} WHERE name LIKE  '%${searchTerm}%' ORDER BY ${orderBy} DESC LIMIT 10`,
        [],
      );
      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          items.push(result.rows.item(index));
        }
      });
      return items;
    } catch (error) {
      console.error(error);
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