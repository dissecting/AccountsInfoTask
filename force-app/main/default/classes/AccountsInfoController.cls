public with sharing class AccountsInfoController {

    @AuraEnabled
    public static AccountsWithFields getAccountList(Integer pageSize, Integer pageNumber) {

        String soql = 'SELECT ';
        List<Schema.FieldSetMember> fieldSet = SObjectType.Account.FieldSets.AccountFieldSet.getFields();
        List<String> fieldSetItems = new List<String>();
        List<String> fieldSetTypeList = new List<String>();

        for (Schema.FieldSetMember f : fieldSet) {
            fieldSetItems.add(f.getFieldPath());
            fieldSetTypeList.add(String.valueOf(f.getType()));
        }

        if (!fieldSetItems.contains('Name')) {
            fieldSetItems.add(0, 'Name');
            fieldSetTypeList.add(0, 'TEXT');
        }

        soql += String.join(fieldSetItems, ', ');
        soql += ' FROM Account ORDER BY CreatedDate DESC';

        ApexPages.StandardSetController setCtrl = new ApexPages.StandardSetController(Database.getQueryLocator(soql));
        setCtrl.setPageSize(pageSize);
        setCtrl.setpageNumber(pageNumber);

        AccountsWithFields accountsWithFields = new AccountsWithFields();
        accountsWithFields.accountFieldTypes = fieldSetTypeList;
        accountsWithFields.accountFields = fieldSetItems;
        accountsWithFields.accounts = setCtrl.getRecords();
        accountsWithFields.accountCount = setCtrl.getResultSize();

        return accountsWithFields;
    }

    public class AccountsWithFields {

        @AuraEnabled
        public List<Account> accounts { get; set; }
        @AuraEnabled
        public List<String> accountFields { get; set; }
        @AuraEnabled
        public List<String> accountFieldTypes { get; set; }
        @AuraEnabled
        public Integer accountCount { get; set; }

        public AccountsWithFields() {
            this.accounts = new List<Account>();
            this.accountFields = new List<String>();
            this.accountFieldTypes = new List<String>();
        }
    }
}