class AddLocakableToUser < ActiveRecord::Migration
	def up
    change_table(:users) do |t|
			t.lockable :lock_strategy => :failed_attempts, :unlock_strategy => :both
		end
  end
 
  def down
    remove_column :users, :failed_attempts
		remove_column :users, :unlock_token
		remove_column :users, :locked_at
  end
end
